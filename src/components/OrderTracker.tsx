import { CheckCircle2, Circle } from "lucide-react";

export default function OrderTracker({ status }: { status: string }) {
  const steps = ["PENDING", "PREPARING", "DISPATCHED", "DELIVERED"];
  
  if (status === "CANCELLED") {
    return (
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <span className="text-red-500 font-bold text-sm">Order Cancelled</span>
      </div>
    );
  }

  const currentIndex = steps.indexOf(status);

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-xs font-bold text-gray-500 mb-3 uppercase">Order Tracking</p>
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand rounded-full transition-all duration-500" 
          style={{ width: `${(Math.max(currentIndex, 0) / (steps.length - 1)) * 100}%` }} 
        />
        
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-1 bg-white px-1">
              {isCompleted ? (
                <div className={`rounded-full bg-white p-0.5 ${isCurrent ? 'ring-2 ring-brand ring-offset-1' : ''}`}>
                  <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-brand' : 'text-brand/60'}`} />
                </div>
              ) : (
                <div className="rounded-full bg-white p-0.5">
                  <Circle className="w-4 h-4 text-gray-200" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map(step => (
          <span key={step} className="text-[9px] font-bold text-gray-400 w-12 text-center leading-tight">
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
