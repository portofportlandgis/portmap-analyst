mapboxgl.accessToken = '<Mapbox ID>';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [0, 0],
    zoom: 2,
    preserveDrawingBuffer: true,
});

// handles click/touch event across devices 
let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

// navigation controls
map.addControl(new mapboxgl.NavigationControl()); // zoom controls

// scale bar
map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 150,
    unit: 'imperial',
}));

// geolocation 
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
}));

//This overides the Bootstrap modal "enforceFocus" to allow user interaction with main map
$.fn.modal.Constructor.prototype.enforceFocus = function () {};

// print function 
var printBtn = document.getElementById('mapboxgl-ctrl-print');
var exportView = document.getElementById('export-map');

var printOptions = {
    disclaimer: "Port of Portland geospatial data is gathered, maintained and primarily used for internal reference and analysis, and is only updated as resources permit. Geospatial data refers to data and information referenced to a location on the Earth's surface such as maps, charts, air photos, satellite images, cadastre and land and water surveys, in digital or hard copy form. Geospatial data may be gathered and maintained by more than one person or department within the Port, and data distributed by one person or department may not reflect the most recent data available from the Port or from other sources. Port geospatial data is not intended for survey or engineering purposes or to describe the authoritative or precise location of boundaries, fixed human works, or the shape and contour of the earth. The Port makes no warranty of any kind, expressed or implied, including any warranty of merchantability, fitness for a particular purpose, or any other matter with respect to its geospatial data. The Port is not responsible for possible errors, omissions, misuse, or misrepresentation of its geospatial data. Port geospatial data is not intended as a final determination of such features as existing or proposed infrastructure, conservation areas, or the boundaries of regulated areas such as wetlands, all of which are subject to surveying or delineation and may change over time. No representation is made concerning the legal status of any apparent route of access identified in geospatial data. The foregoing disclaimer applies to uses of Port geospatial data in any context, including online access at Port workstations, remote access, or use in downloaded digital or hard copy form.",
    northArrow: 'assets/plugins/print-export/north_arrow.svg'
}

printBtn.onclick = function (e) {
    PrintControl.prototype.initialize(map, printOptions)
}

exportView.onclick = function (e) {
    PrintControl.prototype.exportMap();
    e.preventDefault();
}

//draw api
var draw = new MapboxDraw({
    displayControlsDefault: true,
    controls: {
        //point: true,
        //polygon: true,
        //line_string: true,
        //trash: true
    }
});

map.addControl(draw);

//Enter Lat Long
//Enter Lat Long
//Enter Lat Long

map.on('load', function () {

    $(document).ready(function () {


        //clear
        $('#findLLButtonClear').click(function () {

            map.removeLayer("enterLL");
            map.removeSource("enterLL");

            if (map.getLayer("enterLL")) {
                map.removeLayer("enterLL");
                map.removeSource("enterLL");
            }

        });

        //create
        $('#findLLButton').click(function () {

            var enterLng = +document.getElementById('lngInput').value
            var enterLat = +document.getElementById('latInput').value

            var enterLL = turf.point([enterLng, enterLat]);

            map.addSource('enterLL', {
                type: 'geojson',
                data: enterLL
            });

            map.addLayer({
                id: 'enterLL',
                type: 'circle',
                source: 'enterLL',
                layout: {},
                paint: {
                    "circle-color": 'red',
                    "circle-radius": 8,
                }
            });

            map.flyTo({
                center: [enterLng, enterLat]
            });

        });
    });
});

// Coordinates Tool
// Coordinates Tool
// Coordinates Tool

map.on(touchEvent, function (e) {
    //coordinates tool
    document.getElementById('info').innerHTML =
        JSON.stringify(e.lngLat, function (key, val) {
            return val.toFixed ? Number(val.toFixed(4)) : val;
        }).replace('{"lng":', '').replace('"lat":', ' ').replace('}', '')

});


//// Turf Area Calc
var selectedUnits = '';
var selectedMeasuredFeature = '';
var measurementActive = false;


function removeMeasurementValues() {
    $('#calculated-area p').remove();
    $('#calculated-length p').remove();
}

function calculateDimensions(data) {
    if (!data.id) return;

    var area, rounded_area, areaAnswer, length, rounded_length, lineAnswer;
    //FEET
    if (selectedUnits === 'feet') {

        area = turf.area(data) / 0.09290304;
        // restrict to 2 decimal points
        rounded_area = Math.round(area * 100) / 100;
        areaAnswer = document.getElementById('calculated-area');
        areaAnswer.innerHTML = '<p>' + rounded_area + ' ft<sup>2</sup></p>';

        length = turf.length(data, {
            units: 'meters'
        }) / 0.3048;
        // restrict to 2 decimal points
        rounded_length = Math.round(length * 100) / 100;
        lineAnswer = document.getElementById('calculated-length');
        lineAnswer.innerHTML = '<p>' + rounded_length + ' ft</p>';

        //METER
    } else if (selectedUnits === 'meter') {

        area = turf.area(data);
        // restrict to 2 decimal points
        rounded_area = Math.round(area * 100) / 100;
        areaAnswer = document.getElementById('calculated-area');
        areaAnswer.innerHTML = '<p>' + rounded_area + ' m<sup>2</sup></p>';

        length = turf.length(data, {
            units: 'meters'
        });
        // restrict to 2 decimal points
        rounded_length = Math.round(length * 100) / 100;
        lineAnswer = document.getElementById('calculated-length');
        lineAnswer.innerHTML = '<p>' + rounded_length + ' m</p>';

        //MILE
    } else if (selectedUnits === 'mile') {

        area = turf.area(data) / 2589988.11;
        // restrict to 4 decimal points
        rounded_area = Math.round(area * 10000) / 10000;
        areaAnswer = document.getElementById('calculated-area');
        areaAnswer.innerHTML = '<p>' + rounded_area + ' mi<sup>2</sup></p>';

        length = turf.length(data, {
            units: 'meters'
        }) / 1609.344;
        // restrict  to 2 decimal points
        rounded_length = Math.round(length * 100) / 100;
        lineAnswer = document.getElementById('calculated-length');
        lineAnswer.innerHTML = '<p>' + rounded_length + ' mi</p>';

        //KILOMETER
    } else if (selectedUnits === 'kilometer') {

        area = turf.area(data) / 1000000;
        // restrict to 4 decimal points
        rounded_area = Math.round(area * 10000) / 10000;
        areaAnswer = document.getElementById('calculated-area');
        areaAnswer.innerHTML = '<p>' + rounded_area + ' km<sup>2</sup></p>';

        length = turf.length(data, {
            units: 'meters'
        }) / 1000;
        // restrict to 2 decimal points
        rounded_length = Math.round(length * 100) / 100;
        lineAnswer = document.getElementById('calculated-length');
        lineAnswer.innerHTML = '<p>' + rounded_length + ' km</p>';

        //ACRE
    } else if (selectedUnits === 'acre') {

        area = turf.area(data) / 4046.85642;
        // restrict  to 4 decimal points
        rounded_area = Math.round(area * 10000) / 10000;
        areaAnswer = document.getElementById('calculated-area');
        areaAnswer.innerHTML = '<p>' + rounded_area + ' acres</p>';

        length = turf.length(data, {
            units: 'meters'
        }) / 0.3048;
        // restrict to 2 decimal points
        rounded_length = Math.round(length * 100) / 100;
        lineAnswer = document.getElementById('calculated-length');
        lineAnswer.innerHTML = '<p>' + rounded_length + ' ft</p>';

    }
}

// callback fires on the events listed below and fires the
// above calculateDimensions function
var calculateCallback = function (e) {
    if (e.features.length && (e.features[0].geometry.type === 'Polygon' || e.features[0].geometry.type === 'LineString')) {
        measurementActive = true;
        selectedMeasuredFeature = e.features[0].id;
        calculateDimensions(e.features[0]);
    }
}

map.on('draw.create', calculateCallback);
map.on('draw.update', calculateCallback);
map.on('draw.selectionchange', calculateCallback);

map.on('draw.delete', function (e) {
    selectedMeasuredFeature = '';
    measurementActive = false;
    removeMeasurementValues();
});

// apparently there's no method to track/watch a drag or vertex
// of a newly instantiated feature that has yet to be 'created'
// or perhaps it's not documented anywhere in GL Draw
// so we have to make our own
map.on('mousemove', function (e) {
    if (draw.getMode() === 'draw_line_string' || draw.getMode() === 'draw_polygon') {
        var linePts = draw.getFeatureIdsAt(e.point);

        if (linePts.length) {
            // some draw features return back as undefined
            var activeID = linePts.filter(function (feat) {
                return typeof feat === 'string';
            })

            if (activeID.length) {
                measurementActive = true;
                selectedMeasuredFeature = activeID[0];

                var fc = draw.get(selectedMeasuredFeature);
                calculateDimensions(fc);
            }
        }
    } else if (draw.getMode() === 'direct_select' && selectedMeasuredFeature !== '') {
        var fc = draw.get(selectedMeasuredFeature);

        if (fc.geometry.type === 'LineString' || fc.geometry.type === 'Polygon') {
            calculateDimensions(fc);
        }

    }
});

// remove measurements from input
map.on('click', function (e) {
    if (measurementActive) {
        var measuredFeature = draw.getFeatureIdsAt(e.point);

        if (measuredFeature.length) {
            // some draw features return back as undefined
            var mF = measuredFeature.filter(function (feat) {
                return typeof feat === 'string';
            })

            selectedMeasuredFeature = mF.length ? mF[0] : '';

        } else {
            removeMeasurementValues();
        }
    } else {
        removeMeasurementValues();
    }

    measurementActive = false;
});


$(function () {
    // set unit value
    selectedUnits = $('input[type=radio][name=unit]:checked').val();

    $('input[type=radio][name=unit]').change(function () {
        selectedUnits = this.value;

        //update values based on new units
        if (selectedMeasuredFeature !== '' || measurementActive) {
            var gj = draw.get(selectedMeasuredFeature);
            calculateDimensions(gj);
        }
    })

});


//Buffer Start
//Buffer Start
//Buffer Start

$('input[type=radio][name=unitBufferToggle]').change(function () {
    if (this.value == 'off') {

        map.removeLayer("buffered");
        map.removeSource("buffered");

        map.on('draw.create', updateArea);
        map.on('draw.delete', updateArea);
        map.on('draw.update', updateArea);
        map.on('draw.selectionchange', updateArea);

        function updateArea(e) {

            if (map.getLayer("buffered")) {
                map.removeLayer("buffered");
                map.removeSource("buffered");
            }

        }


    } else if (this.value == 'on') {

        map.on('draw.create', updateArea);
        map.on('draw.delete', updateArea);
        map.on('draw.update', updateArea);
        map.on('draw.selectionchange', updateArea);

        function updateArea(e) {

            var data2 = draw.getSelected();

            if (map.getLayer("buffered")) {
                map.removeLayer("buffered");
                map.removeSource("buffered");
            }

            if (data2.features.length) {

                var bufferUnit = +document.getElementById('numberInput').value
                //var buffered = turf.buffer(data2, bufferUnit, { units: 'miles' });

                var radioButtonValue = $('input[type=radio][name=unitBuffer]:checked').val();

                //FEET
                if (radioButtonValue === 'feet-buffer') {

                    var buffered = turf.buffer(data2, bufferUnit / 3280.84);

                    //METER
                } else if (radioButtonValue === 'meter-buffer') {

                    var buffered = turf.buffer(data2, bufferUnit / 1609.344);

                    //MILE
                } else if (radioButtonValue === 'mile-buffer') {

                    var buffered = turf.buffer(data2, bufferUnit, {
                        units: 'miles'
                    });

                    //KILOMETER
                } else if (radioButtonValue === 'kilometer-buffer') {

                    var buffered = turf.buffer(data2, bufferUnit, {
                        units: 'kilometers'
                    });

                }

                map.addSource('buffered', {
                    type: 'geojson',
                    data: buffered
                });

                map.addLayer({
                    id: 'buffered',
                    type: 'fill',
                    source: 'buffered',
                    layout: {},
                    paint: {
                        "fill-color": 'red',
                        "fill-opacity": .2
                    }
                });

            }

            //export buffer function 
            document.getElementById('export-buffer').onclick = function (e) {
                var convertedBuffer = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(buffered));

                // Create export
                document.getElementById('export-buffer').setAttribute('href', 'data:' + convertedBuffer);
                document.getElementById('export-buffer').setAttribute('download', 'buffer.json');
            }
            //end export function 
        }

    }
});

//center of mass
//center of mass
//center of mass

$('input[type=radio][name=unitMass]').change(function () {
    if (this.value == 'off') {

        if (map.getLayer("center")) {
            map.removeLayer("center");
            map.removeSource("center");
        }

        map.on('draw.create', updateCenter);
        map.on('draw.delete', updateCenter);
        map.on('draw.update', updateCenter);
        map.on('draw.selectionchange', updateCenter);

        function updateCenter(e) {

            if (map.getLayer("center")) {
                map.removeLayer("center");
                map.removeSource("center");
            }

        }
    } else if (this.value == 'on') {

        map.on('draw.create', updateCenter);
        map.on('draw.delete', updateCenter);
        map.on('draw.update', updateCenter);
        map.on('draw.selectionchange', updateCenter);

        function updateCenter(e) {

            var data3 = draw.getSelected();

            if (map.getLayer("center")) {
                map.removeLayer("center");
                map.removeSource("center");
            }

            if (data3.features.length) {
                var center = turf.centerOfMass(data3);

                map.addSource('center', {
                    type: 'geojson',
                    data: center
                });

                map.addLayer({
                    id: 'center',
                    type: 'circle',
                    source: 'center',
                    layout: {},
                    paint: {
                        "circle-color": 'green',
                        "circle-radius": 6,
                    }
                });

            }
        }

    }
});


//grid
//grid
//grid

map.on('load', function () {

    $(document).ready(function () {


        //clear
        $('#gridButtonClear').click(function () {

            map.removeLayer("squareGrid");
            map.removeSource("squareGrid");

            if (map.getLayer("squareGrid")) {
                map.removeLayer("squareGrid");
                map.removeSource("squareGrid");
            }

        });

        //create
        $('#gridButton').click(function () {

            var nwLng = +document.getElementById('nwLngInput').value
            var nwLat = +document.getElementById('nwLatInput').value

            var seLng = +document.getElementById('seLngInput').value
            var seLat = +document.getElementById('seLatInput').value

            var cellValue = +document.getElementById('cellValueInput').value


            var bbox = [nwLng, nwLat, seLng, seLat];
            var cellSide = cellValue;
            //var options = { units: 'miles' };

            var radioButtonValueGrid = $('input[type=radio][name=unitGrid]:checked').val();

            //FEET
            if (radioButtonValueGrid === 'feet-grid') {
                var options = ({
                    units: 'miles'
                });
                var squareGrid = turf.squareGrid(bbox, cellSide * 0.000189394, options);

                //METER
            } else if (radioButtonValueGrid === 'meter-grid') {
                var options = ({
                    units: 'kilometers'
                });
                var squareGrid = turf.squareGrid(bbox, cellSide / 1000, options);

                //MILE
            } else if (radioButtonValueGrid === 'mile-grid') {
                var options = {
                    units: 'miles'
                };
                var squareGrid = turf.squareGrid(bbox, cellSide, options);

                //KILOMETER
            } else if (radioButtonValueGrid === 'kilometer-grid') {
                var options = {
                    units: 'kilometers'
                };
                var squareGrid = turf.squareGrid(bbox, cellSide, options);
            }

            //var squareGrid = turf.squareGrid(bbox, cellSide, options);

            map.addSource('squareGrid', {
                type: 'geojson',
                data: squareGrid
            });

            map.addLayer({
                id: 'squareGrid',
                type: 'line',
                source: 'squareGrid',
                layout: {},
                paint: {
                    "line-color": 'red',

                }
            });


            //export buffer function 
            document.getElementById('export-grid').onclick = function (e) {
                var convertedGrid = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(squareGrid));

                // Create export
                document.getElementById('export-grid').setAttribute('href', 'data:' + convertedGrid);
                document.getElementById('export-grid').setAttribute('download', 'grid.json');
            }
            //end export function 


        });
    });
});


//great circle
//great circle
//great circle
map.on('load', function () {

    $(document).ready(function () {


        //clear
        $('#greatCircleButtonClear').click(function () {

            map.removeLayer("greatCircle");
            map.removeSource("greatCircle");

            if (map.getLayer("greatCircle")) {
                map.removeLayer("greatCircle");
                map.removeSource("greatCircle");
            }

        });

        //create
        $('#greatCircleButton').click(function () {

            var startPointLng = +document.getElementById('startLngInput').value
            var startPointLat = +document.getElementById('startLatInput').value

            var endPointLng = +document.getElementById('endLngInput').value
            var endPointLat = +document.getElementById('endLatInput').value

            var start = turf.point([startPointLng, startPointLat]);
            var end = turf.point([endPointLng, endPointLat]);

            var greatCircle = turf.greatCircle(start, end);

            var nmLength = turf.length(greatCircle, {
                units: 'miles'
            }) / 1.151;
            rounded_nm_area = Math.round(nmLength * 10000) / 10000;
            document.getElementById("nmCalc").innerHTML = rounded_nm_area + " " + "nm";


            map.addSource('greatCircle', {
                type: 'geojson',
                data: greatCircle
            });

            map.addLayer({
                id: 'greatCircle',
                type: 'line',
                source: 'greatCircle',
                layout: {},
                paint: {
                    "line-color": 'blue',
                    "line-width": 3,
                    "line-opacity": .5,

                }
            });
        });
    });
});


//get coords
//get coords
//get coords
map.on('draw.create', updateCoords);
map.on('draw.delete', updateCoords);
map.on('draw.update', updateCoords);
map.on('draw.selectionchange', updateCoords);

function updateCoords(e) {

    var dataCoords = draw.getSelected();
    var coords = turf.coordAll(dataCoords);

    document.getElementById("coordsOutput").innerHTML = coords;

}


//export drawn features
document.getElementById('export-draw').onclick = function (e) {
    // Extract GeoJson from featureGroup
    var data = draw.getSelected();

    if (data.features.length > 0) {
        // Stringify the GeoJson
        var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

        // Create export
        document.getElementById('export-draw').setAttribute('href', 'data:' + convertedData);
        document.getElementById('export-draw').setAttribute('download', 'data.json');

    } else {
        alert("There is no data to export.");
    }

}


//drag and drop
//drag and drop
//drag and drop
//drag and drop

// object to hold geojson
var data = {};

// test if file api is available
if (window.File && window.FileReader && window.FileList && window.Blob) {


    // handle read geojson
    // Update progress
    var updateProgress = function (theFile) {
        return function (e) {
            // evt is an ProgressEvent. 100/2 as loading is ~ half the process
            if (e.lengthComputable) {
                var percentLoaded = Math.round((e.loaded / e.total) * 50);
                progressScreen(
                    true,
                    theFile.name,
                    percentLoaded,
                    theFile.name + " loading (" + percentLoaded + "%)"
                );
            }
        };
    };
    // init progress bar
    var startProgress = function (theFile) {
        return function (e) {
            progressScreen(
                true,
                theFile.name,
                0,
                theFile.name + " init .. "
            );
        };
    };
    // on error, set progress to 100 (remove it)
    var errorProgress = function (theFile) {
        return function (e) {
            progressScreen(
                true,
                theFile.name,
                100,
                theFile.name + "stop .. "
            );
        };
    };

    // handle worker
    var startWorker = function (theFile) {
        return function (e) {
            // Create a worker to handle this file
            var w = new Worker("assets/js/handleReadJson.js");

            // parse file content before passing to worker.
            var gJson = JSON.parse(e.target.result);

            // Message to pass to the worker
            var res = {
                json: gJson,
                fileName: theFile.name
            };

            // handle message received
            w.onmessage = function (e) {
                var m = e.data;
                if (m.progress) {
                    progressScreen(
                        true,
                        theFile.name,
                        m.progress,
                        theFile.name + ": " + m.message
                    );
                }

                // send alert for errors message
                if (m.errorMessage) {
                    alert(m.errorMessage);
                }

                // If extent is received
                if (m.extent) {
                    map.fitBounds(m.extent);
                }

                // If layer is valid and returned
                if (m.jsonReady) {
                    try {
                        progressScreen(
                            true,
                            theFile.name,
                            100,
                            theFile.name + " done"
                        );

                        // Remove "crs" property before passing to the Draw API, 
                        // because geojsonhint throws an error if it's present.
                        delete gJson["crs"]

                        data[m.id] = gJson;

                        //add GeoJSON to Draw API
                        var featureIds = draw.add(gJson);
                    } catch (err) {
                        alert(err);
                    }
                    // close worker
                    w.terminate();
                }

            };

            // launch process
            try {
                w.postMessage(res);
            } catch (err) {
                alert("An error occured, quick ! check the console !");
                console.log({
                    res: res,
                    err: err
                });
            }
        };
    };

    var updateLayerList = function (theFile) {
        return function (e) {};
    };
    // handle drop event
    var handleDropGeojson = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files;

        var nFiles = files.length;
        var incFile = 100 / nFiles;
        var progressBar = 0;

        // In case of multiple file, loop on them
        for (var i = 0; i < nFiles; i++) {

            f = files[i];

            // Only process geojson files. Validate later.
            if (f.name.toLowerCase().indexOf(".json") == -1) {
                alert(f.name + " not supported");
                continue;
            }
            // get a new reader
            var reader = new FileReader();
            // handle events
            reader.onloadstart = (startProgress)(f);
            reader.onprogress = (updateProgress)(f);
            reader.onerror = (errorProgress)(f);
            reader.onload = (startWorker)(f);
            reader.onloadend = (updateLayerList)(f);
            // read the geojson
            reader.readAsText(f);
        }
    };
    var handleDragOver = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    };

    // Set events
    mapEl = document.getElementById("map");
    mapEl.addEventListener('dragover', handleDragOver, false);
    mapEl.addEventListener('drop', handleDropGeojson, false);


} else {
    alert('The File APIs are not fully supported in this browser.');
}
