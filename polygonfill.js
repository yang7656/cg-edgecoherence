var view;
var ctx;
var polygons = {
    convex: {
        color: '#E71F63', // choose color here!
        vertices: [
            // fill in vertices here!
            [280,300], [340,403], [460,403], [520,300], [460,196], [340,196]
        ]
    },
    concave: {
        color: '#0076B8', // choose color here!
        vertices: [
            // fill in vertices here!
            //[280,300], [320,403], [400,320], [480,403], [520,300], [520,220], [400,80], [280, 220]
            [280, 250], [280,320], [320,380], [380,360], [400,300], [420,360], [480,380], [520,320], [520,250], [400,150]
        ]
    },
    self_intersect: {
        color: '#D97900', // choose color here!
        vertices: [
            // fill in vertices here!
            [200,500], [100,300], [600,200], [450,500], [300,100]
        ]
    },
    interior_hole: {
        color: '#3C4F36', // choose color here!
        vertices: [
            // fill in vertices here!
            [300,500], [600,500], [600,300], [200,300], [400,200], [400,400], [300,200]
        ]
    }
};

// Init(): triggered when web page loads
function Init() {
    var w = 800;
    var h = 600;
    view = document.getElementById('view');
    view.width = w;
    view.height = h;

    ctx = view.getContext('2d');
    
    SelectNewPolygon();
}

// DrawPolygon(polygon): erases current framebuffer, then draws new polygon
function DrawPolygon(polygon) {
    // Clear framebuffer (i.e. erase previous content)
    ctx.clearRect(0, 0, view.width, view.height);

    // Set line stroke color
    ctx.strokeStyle = polygon.color;

    // Create empty edge table (ET)
    var edge_table = [];
    var i;
    for (i = 0; i < view.height; i++) {
        edge_table.push(new EdgeList());
    }

    // Create empty active list (AL)
    var active_list = new EdgeList();
    
    // Step 1: populate ET with edges of polygon
    var y_min = [];
    var y_max = [];
    var XofY_min = [];
    var deltaX = [];
    var deltaY = [];
    var y_minValue = polygon['vertices'][0][1];
    
    for (var i = 0; i < polygon['vertices'].length-1; i++) {
        deltaX[i] = polygon['vertices'][i][0] - polygon['vertices'][i+1][0];
        deltaY[i] = polygon['vertices'][i][1] - polygon['vertices'][i+1][1];
        if (polygon['vertices'][i][1] < polygon['vertices'][i+1][1]) {
            y_min[i] = polygon['vertices'][i][1];
            y_max[i] = polygon['vertices'][i+1][1];
            XofY_min[i] = polygon['vertices'][i][0];
        }
        else {
            y_min[i] = polygon['vertices'][i+1][1];
            y_max[i] = polygon['vertices'][i][1];
            XofY_min[i] = polygon['vertices'][i+1][0];
        }
    }
    for (var k = 0; k < polygon['vertices'].length; k++) {
        if (polygon['vertices'][i][1] < y_minValue) {
            y_minValue = polygon['vertices'][i][1];
        }
    }
    if (polygon['vertices'][0][1] < polygon['vertices'][polygon['vertices'].length-1][1]) {
            y_min[polygon['vertices'].length-1] = polygon['vertices'][0][1];
            y_max[polygon['vertices'].length-1] = polygon['vertices'][polygon['vertices'].length-1][1];
            XofY_min[i] = polygon['vertices'][0][0];
    }
    else {
        y_min[polygon['vertices'].length-1] = polygon['vertices'][polygon['vertices'].length-1][1];
        y_max[polygon['vertices'].length-1] = polygon['vertices'][0][1];
        XofY_min[i] = polygon['vertices'][polygon['vertices'].length-1][0];
    }
    deltaX[polygon['vertices'].length-1] = polygon['vertices'][polygon['vertices'].length-1][0] - polygon['vertices'][0][0];
    deltaY[polygon['vertices'].length-1] = polygon['vertices'][polygon['vertices'].length-1][1] - polygon['vertices'][0][1];
    
    for (var j = 0; j < y_max.length; j++){
        edge = new EdgeEntry(y_max[j],XofY_min[j],deltaX[j],deltaY[j]);
        edge_table[y_min[j]].InsertEdge(edge);
    }
    
    // Step 2: set y to first scan line with an entry in ET
    var scanLine = y_minValue;
    
    // Step 3: Repeat until ET[y] is NULL and AL is NULL
    while ((edge_table[scanLine].first_entry !== null) || (active_list.first_entry !== null)) {
        //   a) Move all entries at ET[y] into AL
        var entries = edge_table[scanLine].first_entry;
        while (entries !== null) {
            active_list.InsertEdge(entries);
            entries = entries.next_entry
        }
        //   b) Sort AL to maintain ascending x-value order
        active_list.SortList();
        //   c) Remove entries from AL whose ymax equals y
        active_list.RemoveCompleteEdges(scanLine);
        //   d) Draw horizontal line for each span (pairs of entries in the AL)
        var firstOfDrawPair = active_list.first_entry;
        while (firstOfDrawPair !== null) {
            
            DrawLine(Math.ceil(firstOfDrawPair['x']), scanLine, Math.ceil(firstOfDrawPair.next_entry['x'])-1, scanLine);
            firstOfDrawPair = firstOfDrawPair.next_entry.next_entry;
        }
        //   e) Increment y by 1
        scanLine = scanLine + 1;
        //   f) Update x-values for all remaining entries in the AL (increment by 1/m)
        var fixValue = active_list.first_entry;
        while (fixValue !== null) {
            fixValue['x'] = fixValue['x'] + fixValue['inv_slope'];
            fixValue = fixValue.next_entry;
        }
    }
}

// SelectNewPolygon(): triggered when new selection in drop down menu is made
function SelectNewPolygon() {
    var polygon_type = document.getElementById('polygon_type');
    DrawPolygon(polygons[polygon_type.value]);
}

function DrawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}