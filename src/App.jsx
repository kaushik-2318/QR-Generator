import './App.css'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import React, { useState } from 'react';
import Loading from './components/Loader'

function App() {

  const formats = ['png', 'svg'];
  const sizes = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

  const [qr, setQr] = useState("")
  const [loading, setLoading] = useState("false");
  const [isActive, setActive] = useState(false);
  const [text, setText] = useState("");
  const [format, setFormat] = useState('png');
  const [margin, setMargin] = useState(4);
  const [sizeValue, setSizeValue] = useState(150);
  const [backgroundcolor, setBackgroundColor] = useState('000000');
  const [color, setColor] = useState('ffffff');
  const [image, setImage] = useState("");
  const [imageRatio, setImageRatio] = useState(0.3);
  const [caption, setCaption] = useState("");
  const [fontfamily, setFontFamily] = useState('sans-serif');
  const [fontsize, setFontSize] = useState(10);
  const [qrBlob, setQrBlob] = useState(null);


  const qrcode = async () => {
    let response;
    if (image == "") {
      response = await fetch(`https://quickchart.io/qr?text=${text}&dark=${color}&light=${backgroundcolor}&ecLevel=Q&format=${format}&size=${sizeValue}&margin=${margin}&caption=${caption}&captionFontFamily=${fontfamily}&captionFontSize=${fontsize}`);
    }
    else {
      response = await fetch(`https://quickchart.io/qr?text=${text}&dark=${color}&light=${backgroundcolor}&ecLevel=Q&format=${format}&size=${sizeValue}&centerImageSizeRatio=${imageRatio}&centerImageUrl=${image}&caption=${caption}&captionFontFamily=${fontfamily}&captionFontSize=${fontsize}`);
    }

    const blob = await response.blob();

    setQrBlob(blob);
    setQr(response.url);
    setDown(response);
    setLoading(false);
  };

  const ToggleClass = () => {
    setActive(!isActive);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputString = text;
    const byteSize = calculateBytes(inputString);

    if (text === "") {
      alert("Please fill Text Field");
      return;
    }

    if (byteSize > 1669) {
      alert("The Amout of data is too bid to store in QR Code");
      return
    }

    qrcode();
    ToggleClass();
    setLoading(true);
  }

  function calculateBytes(inputString) {
    const encoder = new TextEncoder();
    const encodedString = encoder.encode(inputString);
    return encodedString.length;
  }
  
  const handleFormatChange = (option) => {
    setFormat(option.value);
  }

  const handleImageRatioChange = (option) => {
    setImageRatio(option.value);
  }

  const handleDownload = async () => {
    try {
      if (!qrBlob) {
        alert("No QR Code to download.");
        return;
      }
      const url = window.URL.createObjectURL(qrBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QRCode.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error in Downloading the QR Code");
      console.error("Download error:", error);
    }
  };


  const handleShare = async () => {
    try {
      if (!qrBlob) {
        alert("No QR Code to share.");
        return;
      }
      const clipboardItem = new ClipboardItem({ [format === 'svg' ? 'image/svg+xml' : 'image/png']: qrBlob });
      await navigator.clipboard.write([clipboardItem]);
      alert("QR Code image copied to clipboard!");
    } catch (error) {
      console.error("Error copying image to clipboard:", error);
      alert("Error copying image to clipboard. Please try again.");
    }
  };


  const handleBack = () => {
    ToggleClass();
  }

  return (
    <>
      <div className='bg-[#111729] background flex justify-center items-center flex-col gap-10 font-mono text-sm pt-10 sm:py-10' style={{ height: isActive ? "100vh" : "100%" }}>

        <div className="text-blue-700 font-['Roboto'] uppercase text-4xl py-5 sm:p-0">QRCode Generator</div>

        <div className='flex justify-center items-center w-full '>

          <div className='flex-col justify-center items-center gap-10' style={{ display: isActive ? "flex" : "none" }}>
            <div className='relative z-20 flex justify-center items-center'>
              <div className='bg-[#1e2c51] rounded-full absolute w-[280px] h-[280px] -z-10'></div>
              {
                loading ? <div className='z-10 rounded-xl w-[240px] h-[240px]'><Loading /></div> : <div><img className='z-10 rounded-xl w-[240px] h-[240px]' src={qr} alt="QR Code" /></div>
              }
            </div>
            <div className='text-white'>
              (When you download or share it, you will get {sizeValue} X {sizeValue} QR Code.)
            </div>
            <div className='flex flex-col gap-3'>
              <div className='flex justify-around items-center flex-row gap-10 text-white font-medium w-full'>
                <button className='py-[10px] px-[20px] bg-[#3662e3] w-[120px] text-sm text-white border-none rounded-lg cursor-pointer' onClick={handleDownload}>Download</button>
                <button className='py-[10px] px-[20px] bg-[#3662e3] w-[120px] text-sm text-white border-none rounded-lg cursor-pointer' onClick={handleShare}>Share</button>
              </div>
              <button onClick={handleBack} className='py-[10px] px-[20px] bg-[#3662e3] text-white border-none rounded-lg cursor-pointer'>Back Page</button>
            </div>
          </div>

          <form action="" onSubmit={handleSubmit} className={`flex flex-col justify-between text-[#a5afc2] font-medium border-t-4 sm:border-2 border-[#3662e3] bg-[#030617] p-5 sm:p-10 rounded-[30px] rounded-b-none sm:rounded-b-[30px] w-full sm:w-max duration-500  ${caption !== "" && image !== "" ? "h-[770px]" : caption !== "" ? "h-[690px]" : image !== "" ? "h-[650px] sm:h-[680px]" : "h-[630px] sm:h-[600px]"}`} style={{ display: isActive ? "none" : "flex" }}>
            <div className='flex flex-col gap-10 h-max'>

              <label className='flex justify-between items-center w-full'>
                <div>Text: <span className='text-red-500'>*</span></div>
                <input onInput={e => setText(e.target.value)} className='font-normal p-1 px-3 text-black outline-none rounded-sm w-48' type="text" name="text" required />
              </label>

              <label className='flex justify-between items-center gap-10 w-full'>
                <div>Format:</div>
                <Dropdown options={formats.map(format => ({ value: format, label: format }))} onChange={handleFormatChange} placeholder="Select an option" className='w-48 font-normal' />
              </label>

              <div className='flex flex-col sm:flex-row justify-between items-center gap-10'>
                <label className='flex flex-row sm:flex-col justify-between sm:justify-center items-center w-full sm:items-start gap-3'>
                  <div>Size:</div>
                  <input onInput={e => setSizeValue(e.target.value)} className='font-normal p-1 px-3 text-black outline-none rounded-sm w-48' type="number" placeholder='150px' />
                </label>
                {caption == "" && image == "" && (
                  <label className='flex flex-row sm:flex-col justify-between sm:justify-center items-center w-full sm:items-start gap-3' >
                    <div>Margin (in px):</div>
                    <input onInput={e => setMargin(e.target.value)} className='font-normal p-1 px-3 text-black outline-none rounded-sm w-48' type="number" placeholder='4px' />
                  </label>
                )}
              </div>

              <div className='flex flex-col sm:flex-row justify-between items-center gap-10'>
                <label className='flex flex-row sm:flex-col justify-between sm:justify-center items-center w-full sm:items-start gap-3'>
                  <div>Background Color:</div>
                  <input onInput={e => setBackgroundColor(e.target.value.replace(/^#/, ''))} className='font-normal p-1 px-3 text-black outline-none rounded-sm w-48' type="text" placeholder='000000' />
                </label>
                <label className='flex flex-row sm:flex-col justify-between sm:justify-center items-center w-full sm:items-start gap-3'>
                  <div>QR Code Color:</div>
                  <input onInput={e => setColor(e.target.value.replace(/^#/, ''))} className='font-normal p-1 px-3 text-black outline-none rounded-sm w-48' type="text" placeholder='FFFFFF' />
                </label>
              </div>

              <div className='flex flex-col gap-10'>
                <label className='flex  justify-between items-center gap-10 w-full'>
                  <div>Image in QR:</div>
                  <input onInput={e => setImage(e.target.value)} className='font-normal p-1 px-3 text-black outline-none rounded-sm w-48' type="text" placeholder='URL' />
                </label>
                {image != "" && (
                  <label className='flex justify-between items-center gap-10 w-full'>
                    <div>Image Size Ratio</div>
                    <Dropdown options={sizes.map(size => ({ value: size, label: size }))} onChange={handleImageRatioChange} placeholder="Select an option" className='w-48 font-normal' />
                  </label>
                )}
              </div>

              <div className='flex flex-col gap-6'>
                <label className='flex justify-between items-center gap-10 w-full'>
                  <div>Caption:</div>
                  <input onInput={e => setCaption(e.target.value)} className='font-normal p-1 px-3 text-black outline-none rounded-sm w-48' type="text" />
                </label>
                {caption != "" && (
                  <div className='flex flex-col sm:flex-row gap-10'>
                    <label className='flex flex-row sm:flex-col justify-between sm:justify-center items-center w-full sm:items-start gap-3'>
                      <div>Font Family:</div>
                      <input onInput={e => setFontFamily(e.target.value)} className='font-normal p-1 px-3 text-black outline-none rounded-sm w-48' type="text" placeholder='Sans-Serif' />
                    </label>
                    <label className='flex flex-row sm:flex-col justify-between sm:justify-center items-center w-full sm:items-start gap-3'>
                      <div>Font Size:</div>
                      <input onInput={e => setFontSize(e.target.value)} className='font-normal p-1 px-3 text-black outline-none rounded-sm w-48' type="number" placeholder='10px' />
                    </label>
                  </div>
                )}
              </div>

            </div>

            <div className='flex justify-around items-center flex-row gap-20 text-white font-medium'>
              <button type="submit" className='bg-[#3662e3] px-10 py-3 rounded-md'>Submit</button>
              <button type="reset" className='bg-[#3662e3] px-10 py-3 rounded-md'>Reset</button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export default App