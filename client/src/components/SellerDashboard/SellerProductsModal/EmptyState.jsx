/* eslint-disable react/prop-types */
const EmptyState = ({ title, description, icon }) => (
  <div className="text-center p-12 bg-white rounded-xl mx-auto h-screen">
    <div className="mb-4 text-gray-400 mx-auto w-24 h-24">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 max-w-md mx-auto font-medium">{description}</p>
  </div>
);

export default EmptyState;
