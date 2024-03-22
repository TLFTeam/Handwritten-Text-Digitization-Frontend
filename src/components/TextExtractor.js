import React from 'react';

const TextExtractor = ({ text }) => {
  return (
    <div>
      <h2>Extracted Text</h2>
      <textarea className='form-control form-control-lg' rows="5" value={text} readOnly style={{ height: '200px' }} />
    </div>
  );
};

export default TextExtractor;
