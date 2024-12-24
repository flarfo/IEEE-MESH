import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectMemberById } from './membersApiSlice';

const Member = ({ memberId }) => {
    const member = useSelector(state => selectMemberById(state, memberId));
    const navigate = useNavigate();

    if (member) {
        const memberInternshipString = member.internships.toString().replaceAll(',', ', ');
        const memberResearchString = member.research.toString().replaceAll(',', ', ');
        const memberPicture = member.picture;

        // TODO: onclick should take to an expanded profile view, with contact information, etc...
        // make bio, research, etc cutoff rather than flex
        // make research/work topics sortable on click
        return (
            <div className='max-w-4xl mb-8 mx-auto p-6 bg-white shadow-lg rounded-lg flex'>
                {/* Profile Picture */}
                <div className='w-1/4 flex-shrink-0'>
                    <img
                    src='https://via.placeholder.com/150' // Replace with actual profile picture
                    alt='Profile'
                    className='w-full h-auto rounded-full object-cover'
                    />
                </div>

                {/* Profile Details */}
                <div className='w-3/4 pl-6 flex flex-col'>
                    {/* Name */}
                    <h2 className='text-2xl font-semibold text-gray-800 mb-2'>{member.name}</h2>

                    {/* Research Row */}
                    <div className='flex items-start space-x-4 mb-4'>{
                        member.research.map(research => (
                                <div className='bg-gray-100 p-3 rounded-lg text-center w-fit'>
                                    <p className='text-sm font-medium text-gray-600'>Research</p>
                                    <p className='text-sm font-bold text-gray-800'>{research}</p>
                                </div>
                        ))}
                    </div>

                    {/* Bio */}
                    <p className='text-gray-700 text-sm leading-relaxed line-clamp-3'>
                    {member.bio}
                    </p>
                </div>
            </div>

            /*<tr>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{memberResearchString || 'Empty'}</td>
                <td>{memberInternshipString || 'Empty'}</td>
            </tr>*/
        );
    }
    else {
        return null;
    }
};

export default Member;