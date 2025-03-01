import soon from "../../assets/cs.png";

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[95vh] text-center mx-auto">
      <img src={soon} alt="Coming Soon" className="w-100 h-auto mb-6" />
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Coming Soon</h1>
      <p className="text-lg text-gray-600 max-w-md">
        We&apos;re working hard to bring you something amazing. Stay tuned!
      </p>
    </div>
  );
};

export default ComingSoon;
