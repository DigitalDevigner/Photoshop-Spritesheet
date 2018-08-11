#target photoshop

var txt = "";
var PAR = 1;
var DAR = 1;
var folderName;


var myWindow = new Window ("dialog", undefined, undefined, {closeButton: false});
myWindow.alignChildren = "left";
myWindow.text = "CSS Sprite Generator";
myWindow.center();

var myPAR = myWindow.add ("panel");
myPAR.text = "Select pixel aspect ratio source";
myPAR.orientation = "row";
myPAR.alignment = "left";
var radio1 = myPAR.add ("radiobutton", undefined, "@1x sprites");
var radio2 = myPAR.add ("radiobutton", undefined, "@2x sprites");
var radio3 = myPAR.add ("radiobutton", undefined, "@3x sprites");
radio1.value = true;

var myFolder = myWindow.add ("panel");
myFolder.alignment = "left";
myFolder.orientation = "row";
myFolder.text = "Enter folder name for sprite image";
myFolder.add ("statictext", undefined, "Folder:");
var myText = myFolder.add ("edittext", undefined, "images");
myText.alignment = "left";
myText.characters = 20;
myText.active = true;

var myFormats = myWindow.add ("panel");
myFormats.text = "Select output formats";
var size1 = myFormats.add ("checkbox", undefined, "@1x");
var size2 = myFormats.add ("checkbox", undefined, "@1.5x");
var size3 = myFormats.add ("checkbox", undefined, "@2x");
var size4 = myFormats.add ("checkbox", undefined, "@3x");
size1.value = true;
size2.value = true;
size3.value = true;
size4.value = true;
size2.enabled = false;
size3.enabled = false;
size4.enabled = false;
myFormats.alignment = "left";
myFormats.orientation = "row";

var myExport = myWindow.add ("group");
myExport.alignment = "right";
var exportBtn = myExport.add ("button", undefined, "Ok");
myExport.add ("button", undefined, "Cancel");

var myTextGroup = myWindow.add ("group");
var myTextOutput = myTextGroup.add ("edittext", [0,0,300,200],"",{multiline:true});

/*if (myWindow.show() == 1)
{
    alert("You have exported a sprite sheet at " + youSelected(myPAR))
	buildCSS();
}*/

function youSelected(rButtons)
{
    if (radio1.value == true) {
		PAR = 1;
		return radio1.text;
	} else if (radio2.value == true) {
		PAR = 2;
		return radio2.text;
	} else if (radio3.value == true) {
		PAR = 3;
		return radio3.text;
	}
}

myPAR.addEventListener('click', function(event) {
	for (var i = 0; i < myPAR.children.length; i++) {
		if (myPAR.children[i].value == true) {
            //alert("Active: " + myPAR.children[i].text);
			switch (i) {
				case 0:
					DAR = 1;
					size1.value = true;
					size2.enabled = false;
					size3.enabled = false;
					size4.enabled = false;
					break;
				case 1:
					DAR = 1;
					size1.value = true;
					size2.enabled = true;
					size3.enabled = true;
					size4.enabled = false;
					break;
				case 2:
					DAR = 1;
					size1.value = true;
					size2.enabled = true;
					size3.enabled = true;
					size4.enabled = true;
					break;
			}
            return;
         }
	}
});

exportBtn.addEventListener('click', function(event) {
	folderName = myText.text;
	buildCSS();
	alert("You have exported a sprite sheet");
});

myWindow.show();

function buildCSS() {
	var docName = app.activeDocument.name.replace(/\.[^\.]+$/, '');
	var docWidth = activeDocument.width.value / DAR;
	var docHeight = activeDocument.height.value / DAR;
	txt += "." + docName + " { background-image: url(../" + folderName + "/" + docName + "@1x.jpg); background-size: " + docWidth + "px " + docHeight + "px; }\n\n";
	var len = activeDocument.layers.length;
	for (var i = 0; i < len; i++) {
		var layer = activeDocument.layers[i];
		var layerWidth = (layer.bounds[2].value - layer.bounds[0].value) / DAR; //Grab the length
		var layerHeight = (layer.bounds[3].value - layer.bounds[1].value) / DAR; //Grab the width
		var xPos = (layer.bounds[0].value / DAR) * -1;
		var yPos = (layer.bounds[1].value / DAR) * -1;

		txt += "." + layer.name + "{ height: " + layerHeight + "px; width: " + layerWidth + "px; background-position: " + xPos + "px " + yPos + "px; }\n";
		myTextOutput.text = txt;
		//StatusWindow.update()
	}
	if (size2.value === true) {
		txt += [
			"@media",
			"(-webkit-min-device-pixel-ratio: 1.5),",
			"(min-resolution: 1.5dppx),",
			"(min-resolution: 144dpi) {",
			"\t." + docName + " { background-image: url(../" + folderName + "/" + docName + "@15x.jpg); }",
			"}\n"
		].join("\n");
	}
	if (size3.value === true) {
		txt += [
			"@media",
			"(-webkit-min-device-pixel-ratio: 2),",
			"(min-resolution: 2dppx),",
			"(min-resolution: 192dpi) {",
			"\t." + docName + " { background-image: url(../" + folderName + "/" + docName + "@2x.jpg); }",
			"}\n"
		].join("\n");
	}
	if (size4.value === true) {
		txt += [
			"@media",
			"(-webkit-min-device-pixel-ratio: 3),",
			"(min-resolution: 3dppx),",
			"(min-resolution: 288dpi) {",
			"\t." + docName + " { background-image: url(../" + folderName + "/" + docName + "@3x.jpg); }",
			"}\n"
		].join("\n");
	}
	
	saveTxt(txt);
}

function saveTxt(txt)
{
    var Name = app.activeDocument.name.replace(/\.[^\.]+$/, '');
    var Ext = decodeURI(app.activeDocument.name).replace(/^.*\./,'');
    if (Ext.toLowerCase() != 'psd')
        return;

    var Path = app.activeDocument.path;
    var saveFile = File(Path + "/" + Name + ".css");

    if(saveFile.exists)
        saveFile.remove();

    saveFile.encoding = "UTF8";
    saveFile.open("e", "TEXT", "????");
    saveFile.writeln(txt);
    saveFile.close();
	
	savePng();
}

function savePng()
{
    var Name = app.activeDocument.name.replace(/\.[^\.]+$/, '');
    var Ext = decodeURI(app.activeDocument.name).replace(/^.*\./,'');
	var fWidth = activeDocument.width.value * PAR;
	app.activeDocument.resizeImage(UnitValue(fWidth,"px"),null,null,ResampleMethod.BICUBIC);
    if (Ext.toLowerCase() != 'psd')
        return;

    var Path = app.activeDocument.path;
    var saveFile = File(Path + "/" + Name + "@" + PAR + "x.png");

    if(saveFile.exists)
        saveFile.remove();

    var o = new ExportOptionsSaveForWeb();
        o.format = SaveDocumentType.PNG;
        o.PNG8 = false;
        o.transparency = true;
        o.interlaced = false;
        o.includeProfile = false;
    activeDocument.exportDocument(saveFile, ExportType.SAVEFORWEB, o);
	app.activeDocument.resizeImage(UnitValue(fWidth / PAR,"px"),null,null,ResampleMethod.BICUBIC);
}