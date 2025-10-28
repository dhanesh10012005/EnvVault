import React, { useContext, useState } from 'react'
import { AppContext } from '../context'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';


interface Project {
    id: number;
    name: string;
    createdAt: string;
    env?: { [key: string]: string }
}

const Home: React.FC = () => {

    const { projects, setProjects, createProject } = useContext(AppContext) as {
        projects: Project[];
        setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
        createProject: (name: string, secrets: { key: string; value: string }[]) => Promise<Project>;
    };

    const [showModal, setShowModal] = useState(false)
    const [projName, setProjName] = useState('')
    const [envs, setEnvs] = useState<{ key: string, value: string }[]>([{ key: '', value: '' }])

    const addEnvRow = () => {
        setEnvs([...envs, { key: '', value: '' }])
    }

    const saveProject = async () => {
        // const filteredEnvs=envs.filter((env)=>env.key.trim() && env.value.trim())
        try {
            const newProject = await createProject(projName, envs)
            if (newProject) {
                setProjects([...projects, newProject])
                toast.success("New Project created")
                setShowModal(false)
                setProjName('')
                setEnvs([{ key: '', value: '' }])
            }
        }
        catch (error) {
            toast.error(error.message || "Something went wrong")
        }
    }

    const updateEnv = (index: number, field: 'key' | 'value', value: string) => {
        const newEnvs = [...envs];
        newEnvs[index][field] = value;
        setEnvs(newEnvs);
    };

    const deleteEnvRow = (index: number) => {
        const updated = envs.filter((_, i) => i !== index);
        setEnvs(updated);
    };


    const navigate = useNavigate()


    return (
        <div className='relative'>
            <div className='w-full h-full flex flex-wrap justify-center sm:justify-start'>
                {
                    projects.map((proj) =>
                    (
                        <div className='p-4 m-4 overflow-y-auto w-72 lg:w-96 shadow-lg shadow-gray-400 bg-blue-400 rounded-2xl hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer p-10' key={proj.id}>
                            <h1 className='text-white mb-2 text-xl sm:text-2xl'>{proj.name}</h1>
                            <h2><span className='font-bold'>Created At:</span>{proj.createdAt.split("T")[0]}</h2>
                            <div className='flex justify-center items-center text-center mt-3'>
                                <button
                                    onClick={() => navigate('/viewproj', { state: { id: proj.id } })}
                                    className='cursor-pointer text-gray-500 bg-white rounded-xl p-1 hover:bg-green-100 hover:text-black w-30'
                                >
                                    View Project
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className='flex justify-center mt-15'>
                <button className='bg-green-600 text-white rounded-2xl w-44 sm:w-52 h-10 hover:bg-green-500 cursor-pointer p-2 text-lg sm:text-xl' onClick={(() => setShowModal(true))}>
                    Add New Project
                </button>
            </div>

            {showModal && (
                <>
                    <div className='fixed inset-0 bg-black/30 backdrop-blur-sm z-40 '></div>

                    <div className='fixed inset-0 flex justify-center items-center z-50'>
                        <div className='bg-white rounded-2xl w-11/12 sm:w-3/5  max-h-[90vh] overflow-y-auto p-6'>
                            <h2 className='text-2xl mb-4 sm:text-2xl font-bold'>Add New Project</h2>

                            <div className='mb-4'>
                                <label className='block text-lg mb-2 font-semibold'>Project Name</label>
                                <input
                                    type='text'
                                    value={projName}
                                    onChange={(e) => setProjName(e.target.value)}
                                    className='w-full border-2 border-gray-300 rounded-lg p-2'></input>
                            </div>

                            <div>
                                <label className='block text-lg mb-2 font-semibold'>Environment Variables</label>
                                {envs.map((env, index) => (
                                    <div className='sm:flex gap-2 mb-2' key={index}>
                                        <input
                                            type='text'
                                            placeholder='Key'
                                            value={env.key}
                                            onChange={(e) => {
                                                updateEnv(index, 'key', e.target.value)
                                            }}
                                            className='flex-1 border-2 border-gray-300 rounded-lg p-2 mb-3'
                                        />
                                        <input
                                            type='text'
                                            placeholder='Value'
                                            value={env.value}
                                            onChange={(e) => updateEnv(index, 'value', e.target.value)}
                                            className='flex-1 border-2 mb-3 border-gray-300 rounded-lg p-2'
                                        />

                                        <button
                                            onClick={() => deleteEnvRow(index)}
                                            className='bg-red-500 text-white rounded-xl px-3 py-2 mb-3 hover:bg-red-600'
                                        >
                                            ✕
                                        </button>

                                    </div>
                                ))}
                                <button className='bg-blue-500 text-white rounded-2xl w-32 h-9 hover:bg-blue-600 cursor-pointer p-1 text-lg' onClick={addEnvRow}>
                                    + Add Row
                                </button>
                            </div>

                            <div className='flex justify-end mt-6 gap-4'>
                                <button className='bg-red-500 text-white rounded-2xl w-32 h-10 hover:bg-red-600 cursor-pointer p-2 text-lg' onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button className='bg-green-600 text-white rounded-2xl w-32 h-10 hover:bg-green-500 cursor-pointer p-2 text-lg' onClick={saveProject}>
                                    Save
                                </button>
                            </div>
                        </div>

                    </div>
                </>
            )}

        </div>
    )
}

export default Home
