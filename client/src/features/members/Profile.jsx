import React, { useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetMemberByUsernameQuery } from '../members/membersApiSlice';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
    const params = useParams();

    const {
        data: member,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetMemberByUsernameQuery(params.username, {
        pollingInterval: 60000, // refresh data every 60 seconds, on mount 
        refetchOnMountOrArgChange: true
    });

    let content;
    if (isLoading) {
        content = <p>Loading...</p>
    }

    if (isError) {
        content = <p>{error?.data?.message}</p>
    }

    if (isSuccess) {
        content = (
            <div>
                <p>
                    Profile: {params.username}
                </p>
                <p>
                    Name: {member.name}
                </p>
                <p>
                    Bio: {member.bio}
                </p>
                <p>
                    Research: {member.research}
                </p>
                <p>
                    Internships: {member.internships}
                </p>
            </div>
        );
    }

    return content;
};

export default Profile;