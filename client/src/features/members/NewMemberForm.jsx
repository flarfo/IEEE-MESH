import { use, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar';

const NewMemberForm = () => {
    const [curStep, setStep] = useState(1);
    const totalSteps = 3;

    const params = useParams();

    const [name, setName] = useState('');

    const handlePrev = () => {
        if (curStep > 1) {
            setStep(step => step - 1);
        }
    };

    const handleNext = () => {
        if (curStep < totalSteps) {
            setStep(step => step + 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // await register({ name }).unwrap();
        }
        catch (err) { 

        }
    }

    // STEPS: personal information, bio, links, submit

    const Step1 = () => {
        const handleNameInput = (e) => setName(e.target.value);

        const content = (
            <form className='flex flex-col'>
                <label htmlFor='name' className='block font-medium text-gray-700'>Name:</label>
                <input
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    type='text'
                    id='name'
                    value={name}
                    onChange={handleNameInput}
                    autoComplete='off'
                    required
                />
            </form>
        );

        return content;
    };

    const steps = [Step1()];
    const renderStep = (step) => {
        return steps[step - 1];
    }

    return (
        <div className='p-6'>
            <div>
                <ProgressBar numSteps={totalSteps} currentStep={curStep} />
            </div>
            {renderStep(curStep)}
            <div className='mt-6 flex space-x-4'>
                <button className={`px-4 py-2 ${curStep > 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'} rounded`} onClick={handlePrev}>
                    Previous
                </button>
                <button className={`px-4 py-2 ${curStep < totalSteps ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'} rounded`} onClick={handleNext}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default NewMemberForm;