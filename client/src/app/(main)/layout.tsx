import TopNavBar from '@/components/TopNavBar';
import React from 'react'

const layout = ({ children }: {
    children: React.ReactNode;
}) => {
    return (
        <>
            <TopNavBar />
            {children}
        </>
    )
}

export default layout