const MINIMAL_NODE_SIZE = 8;
const MAX_NODE_SIZE = 12;
const ACTIVE_RADIUS_FACTOR = 1.5;
const STROKE = 1;
const FONT_SIZE = 16;
const TICKS = 200;
const FONT_BASELINE = 40;
const MAX_LABEL_LENGTH = 50;

const graphData = {"edges":[{"source":"10947836129789510935316286055106","target":"2948368815919762718"},{"source":"2948368815919762718","target":"10947836129789510935316286055106"},{"source":"2948368815919762718","target":"69159150118191757955"},{"source":"323325086140707919014256217647521544","target":"185158940618943134036268926719478"},{"source":"5677436996423258154767303","target":"185158940618943134036268926719478"},{"source":"6578728046106700843429580","target":"185158940618943134036268926719478"},{"source":"185158940618943134036268926719478","target":"148435233412386193036837809"},{"source":"6578728046106700843429580","target":"148435233412386193036837809"},{"source":"192187888964781428758635","target":"148435233412386193036837809"},{"source":"2948368815919762718","target":"323325086140707919014256217647521544"},{"source":"69159150118191757955","target":"5677436996423258154767303"},{"source":"323325086140707919014256217647521544","target":"5677436996423258154767303"},{"source":"6578728046106700843429580","target":"5677436996423258154767303"},{"source":"185158940618943134036268926719478","target":"6578728046106700843429580"},{"source":"323325086140707919014256217647521544","target":"6578728046106700843429580"},{"source":"185158940618943134036268926719478","target":"192187888964781428758635"},{"source":"6578728046106700843429580","target":"192187888964781428758635"},{"source":"192187888964781428758635","target":"192187888964781428758635"}],"nodes":[{"id":"2948368815919762718","path":"/avernus/notes/Meeting-Zodge","label":"Meeting Zodge"},{"id":"10947836129789510935316286055106","path":"/avernus/notes/The-Road-To-Baldurs-Gate","label":"The Road to Baldurs Gate"},{"id":"69159150118191757955","path":"/avernus/notes/Elfsong-Tavern","label":"Elfsong Tavern"},{"id":"185158940618943134036268926719478","path":"/avernus/notes/Dungeon-of-the-Dead-Three","label":"Dungeon of the Dead Three"},{"id":"148435233412386193036837809","path":"/avernus/notes/Infernal-Puzzlebox","label":"Infernal Puzzlebox"},{"id":"323325086140707919014256217647521544","path":"/avernus/notes/Investigating-the-Murders","label":"Investigating the Murders"},{"id":"5677436996423258154767303","path":"/avernus/notes/Poisoned-Poseidon","label":"Poisoned Poseidon"},{"id":"6578728046106700843429580","path":"/avernus/notes/Trafficking-Amrik","label":"Trafficking Amrik"},{"id":"192187888964781428758635","path":"/avernus/notes/Vanthampur-Manor","label":"Vanthampur Manor"}]}

let nodesData = graphData.nodes;
let linksData = graphData.edges;

const nodeSize = {};

const updateNodeSize = () => {
  nodesData.forEach((el) => {
    let weight =
      3 *
      Math.sqrt(
        linksData.filter((l) => l.source === el.id || l.target === el.id)
          .length + 1
      );
    if (weight < MINIMAL_NODE_SIZE) {
      weight = MINIMAL_NODE_SIZE;
    } else if (weight > MAX_NODE_SIZE) {
      weight = MAX_NODE_SIZE;
    }
    nodeSize[el.id] = weight;
  });
};

const onClick = (d) => {
  window.location = d.path
};

const onMouseover = function (d) {
  const relatedNodesSet = new Set();
  linksData
    .filter((n) => n.target.id == d.id || n.source.id == d.id)
    .forEach((n) => {
      relatedNodesSet.add(n.target.id);
      relatedNodesSet.add(n.source.id);
    });

  node.attr("class", (node_d) => {
    if (node_d.id !== d.id && !relatedNodesSet.has(node_d.id)) {
      return "inactive";
    }
    return "";
  });

  link.attr("class", (link_d) => {
    if (link_d.source.id !== d.id && link_d.target.id !== d.id) {
      return "inactive";
    }
    return "";
  });

  link.attr("stroke-width", (link_d) => {
    if (link_d.source.id === d.id || link_d.target.id === d.id) {
      return STROKE * 4;
    }
    return STROKE;
  });
  text.attr("class", (text_d) => {
    if (text_d.id !== d.id && !relatedNodesSet.has(text_d.id)) {
      return "inactive";
    }
    return "";
  });
};

const onMouseout = function (d) {
  node.attr("class", "");
  link.attr("class", "");
  text.attr("class", "");
  link.attr("stroke-width", STROKE);
};

const sameNodes = (previous, next) => {
  if (next.length !== previous.length) {
    return false;
  }

  const map = new Map();
  for (const node of previous) {
    map.set(node.id, node.label);
  }

  for (const node of next) {
    const found = map.get(node.id);
    if (!found || found !== node.title) {
      return false;
    }
  }

  return true;
};

const sameEdges = (previous, next) => {
  if (next.length !== previous.length) {
    return false;
  }

  const set = new Set();
  for (const edge of previous) {
    set.add(`${edge.source.id}-${edge.target.id}`);
  }

  for (const edge of next) {
    if (!set.has(`${edge.source}-${edge.target}`)) {
      return false;
    }
  }

  return true;
};

const graphWrapper = document.getElementById('graph-wrapper')
const element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
element.setAttribute("id", "node-svg");
element.setAttribute("width", graphWrapper.getBoundingClientRect().width);
element.setAttribute("height", window.innerHeight * 0.8);
graphWrapper.appendChild(element);

const reportWindowSize = () => {
  element.setAttribute("width", window.innerWidth);
  element.setAttribute("height", window.innerHeight);
};

window.onresize = reportWindowSize;

const svg = d3.select("#node-svg");
const width = Number(svg.attr("width"));
const height = Number(svg.attr("height"));
let zoomLevel = 1;

const simulation = d3
  .forceSimulation(nodesData)
  .force("forceX", d3.forceX().x(width / 2))
  .force("forceY", d3.forceY().y(height / 2))
  .force("charge", d3.forceManyBody())
  .force(
    "link",
    d3
      .forceLink(linksData)
      .id((d) => d.id)
      .distance(70)
  )
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("collision", d3.forceCollide().radius(80))
  .stop();

const g = svg.append("g");
let link = g.append("g").attr("class", "links").selectAll(".link");
let node = g.append("g").attr("class", "nodes").selectAll(".node");
let text = g.append("g").attr("class", "text").selectAll(".text");

const resize = () => {
  if (d3.event) {
    const scale = d3.event.transform;
    zoomLevel = scale.k;
    g.attr("transform", scale);
  }

  const zoomOrKeep = (value) => (zoomLevel >= 1 ? value / zoomLevel : value);

  const font = Math.max(Math.round(zoomOrKeep(FONT_SIZE)), 1);

  text.attr("font-size", (d) => font);
  text.attr("y", (d) => d.y - zoomOrKeep(FONT_BASELINE) + 8);
  link.attr("stroke-width", zoomOrKeep(STROKE));
  node.attr("r", (d) => {
    return zoomOrKeep(nodeSize[d.id]);
  });
  svg
    .selectAll("circle")
    .filter((_d, i, nodes) => d3.select(nodes[i]).attr("active"))
    .attr("r", (d) => zoomOrKeep(ACTIVE_RADIUS_FACTOR * nodeSize[d.id]));

  document.getElementById("zoom").innerHTML = zoomLevel.toFixed(2);
};

const ticked = () => {
  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  text
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y - (FONT_BASELINE - nodeSize[d.id]) / zoomLevel);
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);
};

const restart = () => {
  updateNodeSize();
  node = node.data(nodesData, (d) => d.id);
  node.exit().remove();
  node = node
    .enter()
    .append("circle")
    .attr("r", (d) => {
      return nodeSize[d.id];
    })
    .on("click", onClick)
    .on("mouseover", onMouseover)
    .on("mouseout", onMouseout)
    .merge(node);

  link = link.data(linksData, (d) => `${d.source.id}-${d.target.id}`);
  link.exit().remove();
  link = link.enter().append("line").attr("stroke-width", STROKE).merge(link);

  text = text.data(nodesData, (d) => d.label);
  text.exit().remove();
  text = text
    .enter()
    .append("text")
    .text((d) => shorten(d.label.replace(/_*/g, ""), MAX_LABEL_LENGTH))
    .attr("font-size", `${FONT_SIZE}px`)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .on("click", onClick)
    .on("mouseover", onMouseover)
    .on("mouseout", onMouseout)
    .merge(text);

  node.attr("active", (d) => isCurrentPath(d.path) ? true : null);
  text.attr("active", (d) => isCurrentPath(d.path) ? true : null);

  simulation.nodes(nodesData);
  simulation.force("link").links(linksData);
  simulation.alpha(1).restart();
  simulation.stop();

  for (let i = 0; i < TICKS; i++) {
    simulation.tick();
  }

  ticked();
};

const zoomHandler = d3.zoom().scaleExtent([0.2, 3]).on("zoom", resize);

zoomHandler(svg);
restart();

function isCurrentPath(notePath) {
  return window.location.pathname.includes(notePath)
}

function shorten(str, maxLen, separator = ' ') {
  if (str.length <= maxLen) return str;
  return str.substr(0, str.lastIndexOf(separator, maxLen)) + '...';
}