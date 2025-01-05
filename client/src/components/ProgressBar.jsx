
const ProgressBar = ({numSteps, currentStep}) => {

  const content = (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full flex items-center">
        <div className="absolute w-full h-1 bg-gray-200 rounded-full"></div>
        
        {/* Progress fill */}
        <div
          className="absolute h-1 bg-blue-500 rounded-full transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (numSteps - 1)) * 100}%`,
          }}
        ></div>
        <div className='relative flex justify-between items-center w-full'>
          {[...Array(numSteps)].map((step, index) => {
            const isActive = index + 1 <= currentStep;
            return (
              <div key={index} className='flex flex-col items-center text-center'>
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors ${
                    isActive ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-300 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return content;
};

export default ProgressBar;