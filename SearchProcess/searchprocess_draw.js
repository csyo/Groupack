function draw_map(){

	var links = link;

	var nodes = {};

	// Compute the distinct nodes from the links.
	links.forEach(function(link) {
	link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
	link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
	});
	
	var w = localStorage.viewport_width,
		h = parseInt( localStorage.viewport_height )-47;

	var force = d3.layout.force()
		.nodes(d3.values(nodes))
		.links(links)
		.size([w, h])
		.linkDistance(60)
		.charge(-300)
		.on("tick", tick)
		.start();

	var svg = d3.select("#search_process_map")
		.append("svg:svg")
		.attr("width", w)
		.attr("height", h);

	// Per-type markers, as they don't inherit styles.
	svg.append("svg:defs").selectAll("marker")
		.data( type )
		.enter().append("svg:marker")
		.attr("id", String )
		.attr("viewBox", "0 -5 10 10")
		.attr("refX", 15)
		.attr("refY", -1.5)
		.attr("markerWidth", 6)
		.attr("markerHeight", 6)
		.attr("orient", "auto")
		.append("svg:path")
		.attr("d", "M0,-5L10,0L0,5")
		.style("fill",function(d){ return d; });
		

	var path = svg.append("svg:g").selectAll("path")
		.data(force.links())
		.enter().append("svg:path")
		.attr('class','path')
		.attr("class", function(d) { return "link " + d.type; })
		.attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
		.style("stroke",function(d) { return d.type; });
	

	var circle = svg.append("svg:g").selectAll(".node")
					.data(force.nodes())
					.enter().append("svg:g")
					.attr("class",'node')
					.attr('id',function(d,i){ return 'node-' + d.name.replace(/ /g,'_') ; })
					.call(force.drag);
    
		circle.append("svg:circle")
				.attr("r", 6)
				.attr('id',function(d,i){ return 'circle-' + d.name.replace(/ /g,'_') ; });
				
    

	var text = svg.append("svg:g").selectAll("g")
				.data(force.nodes())
				.enter().append("svg:g")
				.attr('class','text');

		// A copy of the text with a thick white stroke for legibility.
		text.append("svg:text")
			.attr("x", 8)
			.attr("y", ".31em")
			.attr("class", "shadow")
			.text(function(d) { return d.name; });

		text.append("svg:text")
			.attr("x", 8)
			.attr("y", ".31em")
			.text(function(d) { return d.name; });

			
	//使用者大頭貼
	//d3.selectAll("") 
	for(var i=0;i<group_member.length;i++){
		d3.selectAll("#node-"+group_member[i].name.replace(/ /g,'_'))
		.append("image")
		.attr("xlink:href", "https://graph.facebook.com/" + all_data[i][0].FB_ID + "/picture")
		.attr("x", -42)
		.attr("y", -14)
		.attr("width", 30)
		.attr("height", 30);	
		
		$("#circle-"+group_member[i].name.replace(/ /g,'_')).css( "fill", type[i] );
	}
	
	
	// Use elliptical arc path segments to doubly-encode directionality.
	function tick() {
		path.attr("d", function(d) {
			var dx = d.target.x - d.source.x,
				dy = d.target.y - d.source.y,
				dr = Math.sqrt(dx * dx + dy * dy);
			return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
		});

		circle.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});

		text.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});
	}

}