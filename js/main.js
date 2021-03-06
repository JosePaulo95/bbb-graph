const buildPNGGraphGrafic = () => {
  let graphics = Viva.Graph.View.svgGraphics();

  // This function let us override default node appearance and create
  // something better than blue dots:
  graphics.node(function(node) {
      // node.data holds custom object passed to graph.addNode():
      var url = '../img/brother'+node.id+'.png';

      return Viva.Graph.svg('image')
            .attr('width', 24)
            .attr('height', 24)
            .link(url);
  });

  // Usually when you have custom look for nodes, you might want to
  // set their position in a new way too. placeNode() method serves
  // this goal:
  graphics.placeNode(function(nodeUI, pos) {
      // nodeUI - is exactly the same object that we returned from
      //   node() callback above.
      // pos - is calculated position for this node.
      nodeUI.attr('x', pos.x - 12).attr('y', pos.y - 12);
  });

  return graphics
}
const addNodes = (graph) => {
  for (let index = 0; index <= 3; index++) {
    graph.addNode(index);
  }

  return graph
}

function onLoad() {
  let graph = Viva.Graph.graph();
  graph = addNodes(graph)
  // graph.addLink(0, 1);

  graphics = buildPNGGraphGrafic()

  // Let's construct simple graph:
  // 0 -> 1 -> 2 -> 3 -> 4 -> 5
  // for (let i = 0; i <= 19; i++) {
  //   for (let j = 0; j <= 19; j++) {
  //     graph.addLink(i, j, { connectionStrength: 1 });
  //   }
  // }


  graph.addLink(0, 1, { connectionStrength: 1 });
  graph.addLink(1, 2, { connectionStrength: 1 });
  graph.addLink(0, 2, { connectionStrength: 1 });
  graph.addLink(0, 3, { connectionStrength: 0});
  graph.addLink(1, 3, { connectionStrength: 0});
  graph.addLink(2, 3, { connectionStrength: 0});
//   graph.addLink(3, 4, { connectionStrength: 0.9 });
//   graph.addLink(4, 5, { connectionStrength: 0.4 });
//   graph.addLink(5, 6, { connectionStrength: 0.1 });

  // let's pin middle node:
  var middle = graph.getNode(1);
  middle.isPinned = true;

  var idealLength = 90;
  var layout = Viva.Graph.Layout.forceDirected(graph, {
      springLength: idealLength,
      springCoeff : 0.0008,
      gravity : -10,
      // This is the main part of this example. We are telling force directed
      // layout, that we want to change length of each physical spring
      // by overriding `springTransform` method:
      springTransform: function (link, spring) {
        spring.length = idealLength * (1 - link.data.connectionStrength);
      }
  });

  // let's pin middle node:
  var middle = graph.getNode(1);
  layout.pinNode(middle, true);

  var renderer = Viva.Graph.View.renderer(graph, {
      layout : layout,
      graphics: graphics
  });

  renderer.run();
}
