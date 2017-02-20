




Template.googlemap.rendered = function () {

    var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
            var selectedColor;
            var colorButtons = {};
    function ShapesMap(_mapContainer, _deleteButton, _clearButton, _console) {

    // state

    var _selection = null;
    var _map = null;
    var _drawingManager = null;
    var _newShapeNextId = 0;
    var _shapes = Array();

    // types

    var RECTANGLE = google.maps.drawing.OverlayType.RECTANGLE;
    var CIRCLE = google.maps.drawing.OverlayType.CIRCLE;
    var POLYGON = google.maps.drawing.OverlayType.POLYGON;
    var POLYLINE = google.maps.drawing.OverlayType.POLYLINE;
    var MARKER = google.maps.drawing.OverlayType.MARKER;

    function typeDesc(type) {

            return "polygon";


    }

    // json reading

    function jsonReadPath(jsonPath) {
        var path = new google.maps.MVCArray();

        for (var i = 0; i < jsonPath.path.length; i++) {
            var latlon =
                new google.maps.LatLng(jsonPath.path[i].lat, jsonPath.path[i].lon);
            path.push(latlon);
        }

        return path;
    }

    function jsonReadRectangle(jsonRectangle) {
        var jr = jsonRectangle;
        var southWest = new google.maps.LatLng(
            jr.bounds.southWest.lat,
            jr.bounds.southWest.lon);
        var northEast = new google.maps.LatLng(
            jr.bounds.northEast.lat,
            jr.bounds.northEast.lon);
        var bounds = new google.maps.LatLngBounds(southWest, northEast);

        var rectangleOptions = {
            bounds: bounds,
            editable: false,
            fillColor: jr.color,
            map: _map
        };

        var rectangle = new google.maps.Rectangle(rectangleOptions);

        return rectangle;
    }

    function jsonReadCircle(jsonCircle) {
        var jc = jsonCircle;

        var center = new google.maps.LatLng(
            jc.center.lat,
            jc.center.lon);

        var circleOptions = {
            center: center,
            radius: parseFloat(jc.radius),
            editable: false,
            fillColor: jc.color,
            map: _map
        };

        var circle = new google.maps.Circle(circleOptions);

        return circle;
    }

    function jsonReadPolyline(jsonPolyline) {
        var path = jsonReadPath(jsonPolyline);

        var polylineOptions = {
            path: path,
            editable: false,
            strokeColor: jsonPolyline.color,
            map: _map
        };

        var polyline = new google.maps.Polyline(polylineOptions);

        return polyline;
    }

    function jsonReadPolygon(jsonPolygon) {
        var paths = new google.maps.MVCArray();

        for (var i = 0; i < jsonPolygon.paths.length; i++) {
            var path = jsonReadPath(jsonPolygon.paths[i]);
            paths.push(path);
        }

        var polygonOptions = {
            paths: paths,
            editable: false,
            fillColor: jsonPolygon.color,
            id: jsonPolygon.ID,
            map: _map
        };

        var polygon = new google.maps.Polygon(polygonOptions);

        return polygon;
    }

    function jsonRead(json) {
        var jsonObject = eval("(" + json + ")");

        for (i = 0; i < jsonObject.shapes.length; i++)
        {
            switch (jsonObject.shapes[i].type) {
            case RECTANGLE:
                var rectangle = jsonReadRectangle(jsonObject.shapes[i]);
                newShapeSetProperties(rectangle, RECTANGLE);
                newShapeAddListeners(rectangle);
                shapesAdd(rectangle);
                break;

            case CIRCLE:
                var circle = jsonReadCircle(jsonObject.shapes[i]);
                newShapeSetProperties(circle, CIRCLE);
                newShapeAddListeners(circle);
                shapesAdd(circle);
                break;

            case POLYLINE:
                var polyline = jsonReadPolyline(jsonObject.shapes[i]);
                newShapeSetProperties(polyline, POLYLINE);
                newShapeAddListeners(polyline);
                shapesAdd(polyline);
                break;

            case POLYGON:
                var polygon = jsonReadPolygon(jsonObject.shapes[i]);
                newShapeSetProperties(polygon, POLYGON);
                newShapeAddListeners(polygon);
                shapesAdd(polygon);
                break;
            }
        }
    }

    // json writing

    function comma(i) {
        return (i > 0) ? ',' : '';
    }

    function jsonMakeLatlon(latlon) {
        var buf =
            '"lat":"' + latlon.lat() + '","lon":"' + latlon.lng() + '"';

        return buf;
    }

    function jsonMakeBounds(bounds) {
        var buf =
            '"bounds":{'
            + '"northEast":{' + jsonMakeLatlon(bounds.getNorthEast()) + '},'
            + '"southWest":{' + jsonMakeLatlon(bounds.getSouthWest()) + '}'
            + '}';

        return buf;
    }

    function jsonMakeType(type) {
        var buf = '"type":"' + typeDesc(type) + '"';

        return buf;
    }

    function jsonMakeColor(color) {
        var buf = '"color":"' + color + '"';

        return buf;
    }

    function jsonMakeID(ID) {
        var buf = '"ID":"' + ID + '"';

        return buf;
    }

    function jsonMakeCenter(center) {
        var buf = '"center":{' + jsonMakeLatlon(center) + '}';

        return buf;
    }

    function jsonMakeRadius(radius) {
        var buf = '"radius":"' + radius + '"';

        return buf;
    }

    function jsonMakePath(path) {
        var n = path.getLength();

        var buf = '"path":[';
        for (var i = 0; i < n; i++) {
            var latlon = path.getAt(i);

            buf += comma(i) + '{' + jsonMakeLatlon(latlon) + '}';
        }
        buf += ']';

        return buf;
    }

    function jsonMakePaths(paths) {
        var n = paths.getLength();

        var buf = '"paths":[';
        for (var i = 0; i < n; i++) {
            var path = paths.getAt(i);

            buf += comma(i) + '{' + jsonMakePath(path) + '}';
        }
        buf += ']';

        return buf;
    }

    function jsonMakeRectangle(rectangle) {
        var buf =
            jsonMakeType(RECTANGLE) + ','
            + jsonMakeColor(rectangle.fillColor) + ','
            + jsonMakeBounds(rectangle.bounds);

        return buf;
    }

    function jsonMakeCircle(circle) {
        var buf =
            jsonMakeType(CIRCLE) + ','
            + jsonMakeColor(circle.fillColor) + ','
            + jsonMakeCenter(circle.center) + ','
            + jsonMakeRadius(circle.radius);

        return buf;
    }

    function jsonMakePolyline(polyline) {
        var buf =
            jsonMakeType(POLYLINE) + ','
            + jsonMakeColor(polyline.strokeColor) + ','
            + jsonMakePath(polyline.getPath());

        return buf;
    }

    function jsonMakePolygon(polygon) {
        var buf =
            jsonMakeType(POLYGON) + ','
            + jsonMakeColor(polygon.fillColor) + ','
             + jsonMakeID("123") + ','
            + jsonMakePaths(polygon.getPaths());


        return buf;
    }

    function jsonMake() {
        var buf = '{"shapes":[';
        for (i = 0; i < _shapes.length; i++) {
            switch (_shapes[i].type)
            {




            case POLYGON:
                buf += comma(i) + '{' + jsonMakePolygon(_shapes[i]) + '}';
                break;
            }
        }
        buf += ']}';

        return buf;
    }

    // storage

    function shapesAdd(shape) {
        _shapes.push(shape);
    }

    function shapesDelete(shape) {
        var found = false;

        for (var i = 0; i < _shapes.length && !found; i++) {
            if (_shapes[i] === shape) {
                _shapes.splice(i, 1);
                found = true;
            }
        }
    }

    function shapesHideAll() {
        for (var i = 0; i < _shapes.length; i++) {
            _shapes[i].setMap(null);
        }
    }

    function shapesDeleteAll() {
        print(_shapes.length + " shapes deleted\n");

        _shapes.splice(0, _shapes.length);
    }


     //          ************
     //   SAVE   ************
     //          ************


    function shapesSave() {
        var shapes = jsonMake();

        Session.set( "Shape", shapes );
        toastr.success(Session.get( "Shape"));

    }

    function shapesLoad() {
        var start_length = _shapes.length;
        var mydata=shapes;
        if (mydata){
            jsonRead(unescape(mydata[0].poly));
        }
        var n_loaded = _shapes.length - start_length;
        print(n_loaded + " shapes loaded\n");
    }

    // printing

    function print(string) {
        _console.innerHTML += string;
        _console.scrollTop = _console.scrollHeight;
    }

    function printDrawingMode(drawingManager) {
        print(
            "drawing mode set to "
            + typeDesc(drawingManager.getDrawingMode())
            + "\n");
    }

    // selection

    function selectionPrint() {
        if (_selection == null) {
            print("selection cleared\n");
        }
        else {
            print(_selection.appId + ": selected\n");
        }
    }

    function selectionIsSet() {
        return _selection != null;
    }

    function selectionSet(newSelection) {
        if (newSelection == _selection) {
            return;
        }

        if (_selection != null) {
            _selection.setEditable(false);
            _selection = null;
        }

        if (newSelection != null) {
            _selection = newSelection;
            _selection.setEditable(true);
        }

        selectionPrint();
    }

    function selectionClear() {
        selectionSet(null);
    }

    function selectionDelete() {
        if (_selection != null) {
            _selection.setMap(null);
            selectionClear();
        }
    }

    // new shape integration

    function newShapeAddPathListeners(shape, path) {
        google.maps.event.addListener(
            path,
            'insert_at',
            function () {onShapeEdited(shape)});
        google.maps.event.addListener(
            path,
            'remove_at',
            function () {onShapeEdited(shape)});
        google.maps.event.addListener(
            path,
            'set_at',
            function () {onShapeEdited(shape)});
    }

    function newShapeAddListeners(shape) {
        google.maps.event.addListener(
            shape,
            'click',
            function () {onShapeClicked(shape);});

        switch (shape.type) {
        case RECTANGLE:
            google.maps.event.addListener(
                shape,
                'bounds_changed',
                function () {onShapeEdited(shape);});
            break;

        case CIRCLE:
            google.maps.event.addListener(
                shape,
                'center_changed',
                function () {onShapeEdited(shape);});
            google.maps.event.addListener(
                shape,
                'radius_changed',
                function () {onShapeEdited(shape);});
            break;

        case POLYLINE:
            var path = shape.getPath();
            newShapeAddPathListeners(shape, path);
            break;

        case POLYGON:
            var paths = shape.getPaths();

            var n = paths.getLength();
            for (var i = 0; i < n; i++) {
                var path = paths.getAt(i);
                newShapeAddPathListeners(shape, path);
            }
            break;
        }
    }
    function newShapeSetProperties(shape, type) {
        shape.type = type;
        shape.appId = _newShapeNextId;

        _newShapeNextId++;
    }

    // map creation

    function createMap(mapContainer) {
        var center = new google.maps.LatLng(45.909786, -72.410673);

        var mapOptions = {
            zoom: 8,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            zoomControl: true
        };

        var map = new google.maps.Map(mapContainer, mapOptions);

        google.maps.event.addListener(map, 'click', onMapClicked);

        return map;
    }

    // drawing manager creation

    function drawingManagerCreate() {

        // create drawing manager

        var drawingModes = new Array(
            POLYGON);

        var drawingControlOptions = {
            drawingModes: drawingModes,
            position: google.maps.ControlPosition.TOP_LEFT
        };

        var polyOptions = {
            editable: true,
            draggable:true
        };

        drawingManagerOptions = {
            drawingMode: null,
            drawingControlOptions: drawingControlOptions,
            markerOptions: { draggable: true },
            polylineOptions: { editable: true },
            rectangleOptions: polyOptions,
            circleOptions: polyOptions,
            polygonOptions: polyOptions,
            map: _map
        };

        drawingManager = new google.maps.drawing.DrawingManager(drawingManagerOptions);

        // tie events to map

        google.maps.event.addListener(drawingManager,'overlaycomplete',onNewShape);
        google.maps.event.addListener(drawingManager,'drawingmode_changed',onDrawingModeChanged);

        // print initial drawing mode, selection

        printDrawingMode(drawingManager);
        selectionPrint();

        return drawingManager;
    }

    // event capture

    function onNewShape(event) {
        var shape = event.overlay;

        newShapeSetProperties(shape, event.type);
        newShapeAddListeners(shape);
        shapesAdd(shape);
        shapesSave();
        selectionSet(shape);

        print("new " + typeDesc(event.type) + " created (id = "
              + shape.appId + ")\n");
    }

    function onShapeEdited(shape) {
        print(shape.appId + ": shape edited\n");
        shapesSave();
    }

    function onShapeClicked(shape) {
        print(shape.appId + ": shape clicked\n");
        var polyline = shape;
        Router.go('/Nouveau_territoire/');
        selectionSet(shape);
    }

    function onMapClicked() {
        print("map clicked\n");
        selectionClear();
    }

    function onDeleteButtonClicked() {
        print("delete button clicked\n");

        if (selectionIsSet()) {
            shapesDelete(_selection);
            shapesSave();
            selectionDelete();
        }
    }

    function onClearButtonClicked() {
        print("clear button clicked\n");

        selectionClear();
        shapesHideAll();
        shapesDeleteAll();
        shapesSave();
    }

    function onDrawingModeChanged() {
        printDrawingMode(drawingManager);
        selectionClear();
    }

    function onCreate() {
        _map = createMap(_mapContainer);
        _drawingManager = drawingManagerCreate(_map);

        google.maps.event.addDomListener(
            _deleteButton,
            'click',
            onDeleteButtonClicked);
        google.maps.event.addDomListener(
            _clearButton,
            'click',
            onClearButtonClicked);

        shapesLoad();
    }

    // initialization

    onCreate();

   }


//*************************************************************************** */


                function selectColor (color) {
                selectedColor = color;
                for (var i = 0; i < colors.length; ++i) {
                    var currColor = colors[i];
                    colorButtons[currColor].style.border = currColor == color ? '2px solid #789' : '2px solid #fff';
                }

                // Retrieves the current options from the drawing manager and replaces the
                // stroke or fill color as appropriate.
                var polylineOptions = drawingManager.get('polylineOptions');
                polylineOptions.strokeColor = color;
                drawingManager.set('polylineOptions', polylineOptions);

                var rectangleOptions = drawingManager.get('rectangleOptions');
                rectangleOptions.fillColor = color;
                drawingManager.set('rectangleOptions', rectangleOptions);

                var circleOptions = drawingManager.get('circleOptions');
                circleOptions.fillColor = color;
                drawingManager.set('circleOptions', circleOptions);

                var polygonOptions = drawingManager.get('polygonOptions');
                polygonOptions.fillColor = color;
                drawingManager.set('polygonOptions', polygonOptions);
            }

            function setSelectedShapeColor (color) {
                if (selectedShape) {
                    if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
                        selectedShape.set('strokeColor', color);
                    } else {
                        selectedShape.set('fillColor', color);
                    }
                }
            }

            function makeColorButton (color) {
                var button = document.createElement('span');
                button.className = 'color-button';
                button.style.backgroundColor = color;
                google.maps.event.addDomListener(button, 'click', function () {
                    selectColor(color);
                    setSelectedShapeColor(color);
                });

                return button;
            }

            function buildColorPalette () {
                var colorPalette = document.getElementById('color-palette');
                for (var i = 0; i < colors.length; ++i) {
                    var currColor = colors[i];
                    var colorButton = makeColorButton(currColor);
                    colorPalette.appendChild(colorButton);
                    colorButtons[currColor] = colorButton;
                }
                selectColor(colors[0]);
            }



            function initialize() {
                var shapesMap = new ShapesMap(
                    document.getElementById("map"),
                    document.getElementById("delete-button"),
                    document.getElementById("clear-button"),
                    document.getElementById("console"));
                }

google.maps.event.addDomListener(window, 'load', initialize);
buildColorPalette();


};
