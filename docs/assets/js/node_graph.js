const MINIMAL_NODE_SIZE = 8;
const MAX_NODE_SIZE = 12;
const ACTIVE_RADIUS_FACTOR = 1.5;
const STROKE = 1;
const FONT_SIZE = 16;
const TICKS = 200;
const FONT_BASELINE = 40;
const MAX_LABEL_LENGTH = 50;

let allNodes = [
  { "id": "Alan Alyth", "path": "/avernus/notes/Alan-Alyth", tags: ["character"]},
  { "id": "Chahra Shav", "path": "/avernus/notes/Chahra-Shav", tags: ["character"]},
  { "id": "Flame Zodge", "path": "/avernus/notes/Flame-Zodge", tags: ["character"]},
  { "id": "Thug", "path": "/avernus/notes/Thug", tags: ["character"]},
  { "id": "Veteran", "path": "/avernus/notes/Veteran", tags: ["character"]},
  { "id": "Rungreda Kragmane", "path": "/avernus/notes/Rungreda-Kragmane", tags: ["character"]},
  { "id": "Tarrin Araric", "path": "/avernus/notes/Tarrin-Araric", tags: ["character"]},
  { "id": "Ziem Shav", "path": "/avernus/notes/Ziem-Shav", tags: ["character"]},
  { "id": "Meeting Zodge", "path": "/avernus/notes/Meeting-Zodge", tags: ["scenario"]},
  { "id": "Refugee Camp", "path": "/avernus/notes/Refugee-Camp", tags: ["location"]},
  { "id": "The Road to Baldurs Gate", "path": "/avernus/notes/The-Road-To-Baldurs-Gate", tags: ["scenario"]},
  { "id": "Elfsong Tavern", "path": "/avernus/notes/Elfsong-Tavern", tags: ["scenario"]},
  { "id": "Dungeon of the Dead Three", "path": "/avernus/notes/Dungeon-of-the-Dead-Three", tags: ["scenario"]},
  { "id": "Infernal Puzzlebox", "path": "/avernus/notes/Infernal-Puzzlebox", tags: ["scenario"]},
  { "id": "Investigating the Murders", "path": "/avernus/notes/Investigating-the-Murders", tags: ["scenario"]},
  { "id": "Poisoned Poseidon", "path": "/avernus/notes/Poisoned-Poseidon", tags: ["scenario"]},
  { "id": "Trafficking Amrik", "path": "/avernus/notes/Trafficking-Amrik", tags: ["scenario"]},
  { "id": "Vanthampur Investigations", "path": "/avernus/notes/Vanthampur-Investigations", tags: []},
  { "id": "Vanthampur Manor", "path": "/avernus/notes/Vanthampur-Manor", tags: ["scenario"]},
  { "id": "Rumors of Elturel", "path": "/avernus/notes/Rumors-of-Elturel", tags: []},
  { "id": "Character Frameworks", "path": "/avernus/notes/Character-Frameworks", tags: []},
  { "id": "Location Frameworks", "path": "/avernus/notes/Location-Frameworks", tags: []}
];
let allEdges = [ { "source": "Elfsong Tavern", "target": "Alan Alyth" },{ "source": "Ziem Shav", "target": "Chahra Shav" },{ "source": "The Road to Baldurs Gate", "target": "Chahra Shav" },{ "source": "Meeting Zodge", "target": "Flame Zodge" },{ "source": "Refugee Camp", "target": "Flame Zodge" },{ "source": "The Road to Baldurs Gate", "target": "Flame Zodge" },{ "source": "Rungreda Kragmane", "target": "Thug" },{ "source": "The Road to Baldurs Gate", "target": "Thug" },{ "source": "Flame Zodge", "target": "Veteran" },{ "source": "The Road to Baldurs Gate", "target": "Veteran" },{ "source": "The Road to Baldurs Gate", "target": "Rungreda Kragmane" },{ "source": "The Road to Baldurs Gate", "target": "Tarrin Araric" },{ "source": "Chahra Shav", "target": "Ziem Shav" },{ "source": "The Road to Baldurs Gate", "target": "Ziem Shav" },{ "source": "The Road to Baldurs Gate", "target": "Meeting Zodge" },{ "source": "Meeting Zodge", "target": "Refugee Camp" },{ "source": "The Road to Baldurs Gate", "target": "Refugee Camp" },{ "source": "Alan Alyth", "target": "Elfsong Tavern" },{ "source": "Meeting Zodge", "target": "Elfsong Tavern" },{ "source": "Vanthampur Investigations", "target": "Elfsong Tavern" },{ "source": "Investigating the Murders", "target": "Dungeon of the Dead Three" },{ "source": "Poisoned Poseidon", "target": "Dungeon of the Dead Three" },{ "source": "Trafficking Amrik", "target": "Dungeon of the Dead Three" },{ "source": "Vanthampur Investigations", "target": "Dungeon of the Dead Three" },{ "source": "Dungeon of the Dead Three", "target": "Infernal Puzzlebox" },{ "source": "Trafficking Amrik", "target": "Infernal Puzzlebox" },{ "source": "Vanthampur Investigations", "target": "Infernal Puzzlebox" },{ "source": "Vanthampur Manor", "target": "Infernal Puzzlebox" },{ "source": "Meeting Zodge", "target": "Investigating the Murders" },{ "source": "Vanthampur Investigations", "target": "Investigating the Murders" },{ "source": "Elfsong Tavern", "target": "Poisoned Poseidon" },{ "source": "Investigating the Murders", "target": "Poisoned Poseidon" },{ "source": "Trafficking Amrik", "target": "Poisoned Poseidon" },{ "source": "Vanthampur Investigations", "target": "Poisoned Poseidon" },{ "source": "Dungeon of the Dead Three", "target": "Trafficking Amrik" },{ "source": "Investigating the Murders", "target": "Trafficking Amrik" },{ "source": "Vanthampur Investigations", "target": "Trafficking Amrik" },{ "source": "Dungeon of the Dead Three", "target": "Vanthampur Investigations" },{ "source": "Infernal Puzzlebox", "target": "Vanthampur Investigations" },{ "source": "Investigating the Murders", "target": "Vanthampur Investigations" },{ "source": "Poisoned Poseidon", "target": "Vanthampur Investigations" },{ "source": "Trafficking Amrik", "target": "Vanthampur Investigations" },{ "source": "Vanthampur Manor", "target": "Vanthampur Investigations" },{ "source": "Dungeon of the Dead Three", "target": "Vanthampur Manor" },{ "source": "Trafficking Amrik", "target": "Vanthampur Manor" },{ "source": "Vanthampur Investigations", "target": "Vanthampur Manor" },{ "source": "Meeting Zodge", "target": "Rumors of Elturel" },{ "source": "The Road to Baldurs Gate", "target": "Rumors of Elturel" },{ "source": "Elfsong Tavern", "target": "Rumors of Elturel" } ];
let allTags = [ "character","scenario","location" ];

let activeNodes = [];
let activeEdges = [];
let activeTags = [ "character", "scenario" ];

const nodeSize = {};

const toggleTag = (tagName) => {
    const idx = activeTags.indexOf(tagName)
    if (idx == -1) {
        activeTags.push(tagName);
    }
    else {
        activeTags.splice(idx, 1);
    }
    restart();
};

$('a#character-tag').click(() => {
        toggleTag("character");
    })
$('a#scenario-tag').click(() => {
        toggleTag("scenario");
    })
$('a#location-tag').click(() => {
        toggleTag("location");
    })


const updateActiveNodes = () => {
    
        if (activeTags.indexOf("character") == -1) {
            document.getElementById("character-tag-li").style.removeProperty('background');
        }
        else {
            document.getElementById("character-tag-li").style.background = "#A4C0BF";
        }
    
        if (activeTags.indexOf("scenario") == -1) {
            document.getElementById("scenario-tag-li").style.removeProperty('background');
        }
        else {
            document.getElementById("scenario-tag-li").style.background = "#A4C0BF";
        }
    
        if (activeTags.indexOf("location") == -1) {
            document.getElementById("location-tag-li").style.removeProperty('background');
        }
        else {
            document.getElementById("location-tag-li").style.background = "#A4C0BF";
        }
    
    if (activeTags.length == 0) {
        activeNodes = allNodes;
    }
    else {
        activeNodes = [];
        allNodes.forEach((currNode) => {
            currNode.tags.forEach((currTag) => {
                if (activeTags.indexOf(currTag) != -1) {
                    activeNodes.push(currNode);
                }
            });
        });
    }
    activeEdges = [];
    allEdges.forEach((currEdge) => {
        if (activeNodes.findIndex((currNode) => currNode.id == currEdge.source || currNode.id == currEdge.source.id) != -1 &&
            activeNodes.findIndex((currNode) => currNode.id == currEdge.target || currNode.id == currEdge.target.id) != -1) {
                activeEdges.push(currEdge);
            }
    });
};

const updateNodeSize = () => {
  activeNodes.forEach((el) => {
    let weight =
      3 *
      Math.sqrt(
        activeEdges.filter((l) => l.source === el.id || l.target === el.id)
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
  activeEdges
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
    if (!found || found !== node.id) {
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
  .forceSimulation(activeNodes)
  .force("forceX", d3.forceX().x(width / 2))
  .force("forceY", d3.forceY().y(height / 2))
  .force("charge", d3.forceManyBody())
  .force(
    "link",
    d3
      .forceLink(activeEdges)
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
  updateActiveNodes();
  updateNodeSize();
  node = node.data(activeNodes, (d) => d.id);
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

  link = link.data(activeEdges, (d) => `${d.source.id}-${d.target.id}`);
  link.exit().remove();
  link = link.enter().append("line").attr("stroke-width", STROKE).merge(link);

  text = text.data(activeNodes, (d) => d.id);
  text.exit().remove();
  text = text
    .enter()
    .append("text")
    .text((d) => shorten(d.id.replace(/_*/g, ""), MAX_LABEL_LENGTH))
    .attr("font-size", `${FONT_SIZE}px`)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .on("click", onClick)
    .on("mouseover", onMouseover)
    .on("mouseout", onMouseout)
    .merge(text);

  node.attr("active", (d) => isCurrentPath(d.path) ? true : null);
  text.attr("active", (d) => isCurrentPath(d.path) ? true : null);

  simulation.nodes(activeNodes);
  simulation.force("link").links(activeEdges);
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