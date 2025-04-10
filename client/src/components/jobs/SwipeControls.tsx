interface SwipeControlsProps {
  onReject: () => void;
  onApprove: () => void;
}

const SwipeControls = ({ onReject, onApprove }: SwipeControlsProps) => {
  return (
    <div className="flex justify-center gap-5 mt-6">
      <button 
        onClick={onReject}
        className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center border border-neutral-200 hover:bg-red-50 transition-colors"
        aria-label="Reject job"
      >
        <i className="fas fa-times text-red-500 text-3xl"></i>
      </button>
      <button 
        onClick={onApprove}
        className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center border border-neutral-200 hover:bg-green-50 transition-colors"
        aria-label="Approve job"
      >
        <i className="fas fa-heart text-green-500 text-3xl"></i>
      </button>
    </div>
  );
};

export default SwipeControls;
