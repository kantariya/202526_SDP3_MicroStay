import React from 'react';

const LoadingSkeleton = ({ type = "card", count = 1 }) => {

    const SkeletonCard = () => (
        <div className="bg-white border border-gray-200 rounded-3xl p-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center mt-4">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    );

    const SkeletonList = () => (
        <div className="flex gap-4 items-center animate-pulse p-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    );

    const SkeletonDetails = () => (
        <div className="animate-pulse space-y-8">
            <div className="h-80 bg-gray-200 rounded-3xl w-full"></div>
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );

    return (
        <div className={`grid gap-6 ${type === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[...Array(count)].map((_, i) => (
                <React.Fragment key={i}>
                    {type === 'card' && <SkeletonCard />}
                    {type === 'list' && <SkeletonList />}
                    {type === 'details' && <SkeletonDetails />}
                </React.Fragment>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
