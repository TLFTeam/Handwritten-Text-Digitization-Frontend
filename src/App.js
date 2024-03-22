import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import TextExtractor from './components/TextExtractor';

const App = () => {
  const [extractedText, setExtractedText] = useState('');

  const handleUpload = (text) => {
    setExtractedText(text);
  };

  return (
    <div className='bg-dark text-white'>
      <h1 align="center" class="jumbotron bg-primary text-white p-3">Hand-Written Text Digitization App</h1>
      <FileUpload onUpload={handleUpload} />
      {extractedText && <TextExtractor text={extractedText} />}
    </div>
  );
};

export default App;
