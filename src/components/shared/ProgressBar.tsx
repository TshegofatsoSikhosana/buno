
function ProgressBar({percentageComplete, borderColor, textColor, additionalText = ""}: {percentageComplete: number | string, borderColor?: string, textColor?: string, additionalText?: string }) {
  
  
    function isOverBudget(){
        return Number(percentageComplete) > 100;
    }
    return (
      <div className="w-100 font-bold goal-progress-bar-container">
        <div
          className="inline-block mr-5 goal-progress"
          style={{
            border: `2px solid ${ isOverBudget() ? "rgba(128, 0, 0, 0.75)" : (borderColor ? borderColor : " rgba(0, 128, 0, 0.75)")}`,
            backgroundColor: `${ isOverBudget() ? "rgba(128, 0, 0, 0.75)" : (borderColor ? borderColor : "rgba(0, 128, 0, 0.75)")}`,
            color: `${ textColor ? textColor : "white"}`,   
            width: `${isOverBudget() ? 100 : percentageComplete}%`,
          }}
        >
          <div className="pl-2">{percentageComplete}% {additionalText}</div>
        </div>
    </div>
  );
}

export default ProgressBar;
