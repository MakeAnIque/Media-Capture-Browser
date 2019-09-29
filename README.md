# MediaCapture Library in JavaScript for Browsers

MediaCapture is used for capturing media ( live stream ) that enable website to integrate its media capturing without any chrome extension and you can do more it.

### Features
  - Take Screenshots
  - Edit Screenshot like - Freehand Sketcha, Text Adding, Crop Image , Filter (Invert) color & Brightness
  - Display Record 
  - Audio Record
  - Both Audio & Video record with System Sound

## How to use
    - $ clone git https://github.com/amitabh-anandcl/mediacapture.git
    
## Integreate in website
- First extract the folder.
- and check js folder that conatin `main.js` file
- just set it in `<script src="/*/main.js"></script>`to end of all script
- now done.
## All functions name in `main.js`
  - `MediaCapture` constructor
    - extends this into your constructor
  - For record Audio & Video
    - Just call `GetAllWithMicrophoneStream()` no params
    - Then select your Screen like - Entire Screen, Chrome Tabs, Windows etc. and Click on `Share` button
    - for stop call `StopRecording()` no params
  - Obtain Blob data of Recorded stream call `Convertblob()` it will return Blob Data
  - if Record Display only no Audio call `RecordDisplayOnly()` no params
  - if Record Audio only no Video call `RecordMicrophone()` no params
  - if you want pause/resume recording call `PauseResume()` np params, during Recrding, `True` for Pause State , `False` for resume State
  - `GetVideoStream()` return VideoStream
  - `GetAudioStream` return Audio Stream
  - `GetCombineStream` return Both Audio and Video Stream

## Image Opertion
   - Screenshot to call `ScreenShot()`
      - `ScreenShot()` create Base64 data, get this by `imageDatas64`
      - `SaveScreenShot()` will convert your base64 to `blob` `Url` data
   - CropImage to call `CropImage(x1 , y1 , x2 , y2)` get cropped Image
      - `x1` - start point
      - `y1` - start point 
      - `x2` - end point
      - `y2` - end point
   - Undo the image in previous state to call `UndoFilterImage()` no params
   - Filter Image to call `FilterImage(color , bright = 1)` get inverted
      - `color` to convert into color `this is experimental not suggest to use`
      - `bright = 1` for brightness `0 - 1`
   - hand Drawing on image to call `DrawFreeOnImage( color )` 
      - `color` like - `green` , `red` , `blue` , `green` , `yellow` in string
   - Add text in Image just `Double Click` image to add text on image
      - you have to set `setTextOnImage = 'your text' ` then double click
   - then download image call `SaveScreenShot()`

# Example
    <body>
	<canvas id = 'can'></canvas>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
	<script type = "text/javascript" src="./main.js"></script>
		
	<script type="text/javascript">
		let  MediaCapture = new MediaCapture()
		
		MediaCapture.windowFullheight = window.innerHeight
		MediaCapture.windowFullWidth  = window.innerWidth
		
		MediaCapture.setTextOnImage = 'Hello Media Capture'
	
		let canElem = document.querySelector('#can')
		
		MediaCapture.CanvasElem = canElem
				
		// Recording Video and Audio
		MediaCapture.GetAllWithMicrphoneStream()
		
		// to stop 
		MediaCapture.StopRecording()

		// after stop recordBLob is objec { 'mimeType' : 'video/webm  , 'blob' : blob} like that
		let recordBlob = MediaCapture.ConvertBlob() 
			
		// to Screen shot

		MediaCapture.ScreenShot()

		let blobImage = MediaCapture.SaveScreenShot()		
	</script>
	</body>

## More Information Visit Website
<a href="https://testing.page.com">https://testing.page.com</a>