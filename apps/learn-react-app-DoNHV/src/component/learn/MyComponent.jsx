//() => {}
// component = html + css + js

import './style.css';
const MyComponent = () => {
  // const DarwinDo = "DarwinDo";//string;
  // const DarwinDo = 21;//number;
  // const DarwinDo = true;//boolean;
  // const DarwinDo = undefined;//undefined;
  // const DarwinDo = null;//null;
  // const DarwinDo = [1, 2, 3];//array;
  const DarwinDo = {
    name: 'DarwinDo',
    age: 21,
    isStudent: true,
    skills: ['HTML', 'CSS', 'JavaScript'],
  }; //object
  return (
    <>
      <div style={{ borderRadius: '10px' }}>{JSON.stringify(DarwinDo)} has tested First Component</div>
      <div className="child"> Test JSX and Fragment</div>
    </>
  );
};

export default MyComponent;
