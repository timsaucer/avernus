---
---

const MINIMAL_NODE_SIZE = 8;
const MAX_NODE_SIZE = 12;
const ACTIVE_RADIUS_FACTOR = 1.5;
const STROKE = 1;
const FONT_SIZE = 16;
const TICKS = 200;
const FONT_BASELINE = 40;
const MAX_LABEL_LENGTH = 50;


{%- assign edges_array = "" -%}
{%- assign nodes_array = "" -%}
{%- assign tag_array = "" -%}

{%- assign first_tag = true -%}
{%- assign first_node = true -%}
{%- assign first_link = true -%}
{%- for note1 in site.notes -%}
    {%- if first_node -%}
        {%- assign first_node = false -%}
        {%- assign nodes_array = nodes_array | append: '  ' -%}
    {%- else -%}
        {%- assign nodes_array = nodes_array | append: ",
  " -%}
    {%- for curr_tag in note1.tags -%}
        {%- unless tag_array contains curr_tag -%}
            {%- if first_tag -%}
                {%- assign first_tag = false -%}
            {%- else -%}
                {%- assign tag_array = tag_array | append: ',' -%}
            {%- endif -%}
            {%- assign tag_array = tag_array | append: '"' | append: curr_tag | append: '"' -%}
        {%- endunless -%}
    {%- endfor -%}
    {%- endif -%}
{%- assign nodes_array = nodes_array | append: '{ "id": "' | append: note1.title | append: '", "path": "' | append: site.baseurl | append: note1.url | append: '", tags: ' | append: note1.tags | append: '}' -%}
    {%- for note2 in site.notes -%}
        {%- if note2.url != note1.url -%}
            {%- if note2.content contains note1.title -%}
                {%- if first_link -%}
                    {%- assign first_link = false -%}
                {%- else -%}
                    {%- assign edges_array = edges_array | append: "," -%}
                {%- endif -%}
                {%- assign edges_array = edges_array | append: '{ "source": "' | append: note2.title | append: '", "target": "' | append: note1.title | append: '" }' -%}
            {%- endif -%}
        {%- endif -%}
    {%- endfor -%}
{% endfor %}

let allNodes = [
{{ nodes_array }}
];
let allEdges = [ {{ edges_array }} ];
let allTags = [ {{ tag_array }} ];

let activeNodes = [];
let activeEdges = [];
let activeTags = [ "scenario" ];

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

{% assign all_tags_as_array = tag_array | remove: '"' | split: "," %}
{%- for curr_tag in all_tags_as_array -%}
    $('a#{{ curr_tag }}-tag').click(() => {
        toggleTag("{{ curr_tag }}");
    })
{% endfor %}

const updateActiveNodes = () => {
    {% for curr_tag in all_tags_as_array %}
        if (activeTags.indexOf("{{ curr_tag }}") == -1) {
          document.getElementById("{{ curr_tag }}-tag-li-enabled").style.display = "none";
          document.getElementById("{{ curr_tag }}-tag-li-disabled").style.display = "inline";

            // document.getElementById("{{ curr_tag }}-tag-li").style.removeProperty('background');
        }
        else {
          document.getElementById("{{ curr_tag }}-tag-li-enabled").style.display = "inline";
          document.getElementById("{{ curr_tag }}-tag-li-disabled").style.display = "none";
            // document.getElementById("{{ curr_tag }}-tag-li").style.background = "#A4C0BF";
        }
    {% endfor %}
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
    .attr("tag", (d) => d.tags[0])
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