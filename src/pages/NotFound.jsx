const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-gray-900 tracking-widest">
            404
          </h1>
          <div className="bg-blue-600 px-2 text-sm rounded rotate-12 absolute">
            Page Not Found
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            Go Back
          </button>
          
          <a
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 no-underline"
          >
            Go to Homepage
          </a>
        </div>
        
        <div className="text-gray-500 text-sm">
          If you think this is a mistake, please contact support.
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;