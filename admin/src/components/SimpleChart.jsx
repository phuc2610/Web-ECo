import React from "react";

const SimpleChart = ({ data, title, type = "bar" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Không có dữ liệu để hiển thị</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.value || 0));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>

      {type === "bar" && (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20 text-sm text-gray-600 font-medium mr-4">{item.label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
              <div className="w-16 text-right text-sm font-semibold text-gray-700 ml-4">
                {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {type === "line" && (
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-around">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-300"
                  style={{ height: `${(item.value / maxValue) * 200}px` }}
                ></div>
                <div className="text-xs text-gray-600 mt-2 text-center">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === "pie" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative w-32 h-32 mx-auto">
            {/* Simple pie chart representation */}
            <div className="w-full h-full bg-gray-200 rounded-full relative overflow-hidden">
              {data.map((item, index) => {
                const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-red-500"];
                const percentage = (item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100;

                return (
                  <div
                    key={index}
                    className={`absolute inset-0 ${colors[index % colors.length]} rounded-full`}
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + percentage}% 0%, ${50 + percentage}% 100%, 50% 100%)`,
                    }}
                  ></div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            {data.map((item, index) => {
              const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-red-500"];
              const percentage = ((item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1);

              return (
                <div key={index} className="flex items-center">
                  <div className={`w-4 h-4 ${colors[index % colors.length]} rounded-full mr-2`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">{item.label}</div>
                    <div className="text-xs text-gray-500">{percentage}%</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleChart;
