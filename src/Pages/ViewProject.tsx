import React, { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../context'
import { useContext } from 'react'
import toast from 'react-hot-toast';

interface Secret {
  _id: string;
  key: string;
  value: string;
}

interface Project {
  _id: string;
  name: string;
  createdAt: string;
  secret: Secret[];
}


const ViewProject: React.FC = () => {

  const tableContainerRef = useRef<HTMLDivElement | null>(null);

    const { deleteProject,changeProjName,editEnv,deleteEnv,addEnv } = useContext(AppContext) as {
           deleteProject :(ProjectId:string)=>Promise<any>,
           changeProjName:(ProjectId:string,name:string)=>Promise<any>,
           editEnv:(projectId:string,envId:string,editedKey:string,editedValue:string)=>Promise<any>,
           deleteEnv:(projectId:string,envId:string)=>Promise<any>,
          addEnv:(projectId:string,key:string,value:string)=>Promise<any>
      };

      const navigate=useNavigate()

  // const locationState = useLocation().state as { id: string };
  // const navigate = useNavigate()
  // const {projects}=useContext(AppContext) as {projects:Project[]}
  // const [project, setProject] = useState<Project | null>(
  //   projects.find((p) => p.id === locationState.id) || null
  // );
  const { projects } = useContext(AppContext) as { projects: Project[] };
  const location = useLocation();
  const locationState = (location.state as { id: string }) || null;

  const [project, setProject] = useState<Project | null>(() => {
    if (!locationState?.id) return null;
    return projects.find((p) => p._id === locationState.id) || null;
  });

  //  const {setProjects}=React.useContext(AppContext) as {setProjects:React.Dispatch<React.SetStateAction<Project[]>>}
  const [projEdit, setProjEdit] = useState<string | null>()
  const [isEdit, setIsEdit] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [isProjEdit,setIsProjEdit]=useState<boolean>(false)

  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showNewRow, setShowNewRow] = useState(false);



  const { setProjects } = useContext(AppContext) as {
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  };

const addEnvVar = async () => {
  try {
    const res = await addEnv(project._id, newKey, newValue);
    if (res) {
      setProject(res);
      setNewKey('');
      setNewValue('');
      setShowNewRow(false);
      toast.success('New Env Added Successfully');
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};


  const doneEdit = async (envId:string, editedKey: string, editedValue: string) => {
     try{
       const res = await editEnv(project._id,envId,editedKey,editedValue)
       if(res.project)
       {
          setProject(res.project)
          toast.success(res.message)
          setIsEdit('')
          setKeyInput('')
          setValueInput('')
        }
     }catch(error)
     {
        toast.error(error.response?.data?.message||"something went wrong")
     }  
  };


  const startEdit = (key: string, val: string,id:string) => {
    setIsEdit(id);
    setKeyInput(key);
    setValueInput(val);
  }

const deleteKey = async (envId: string) => {
  if (!project) return;

  try {
    const resMessage = await deleteEnv(project._id, envId);


    // Optimistically update local state too
    setProject((prev) =>
      prev ? { ...prev, secret: prev.secret.filter((s) => s._id !== envId) } : prev
    );

    toast.success(resMessage || "Deleted successfully");
  } catch (error: any) {
     console.log(error)
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};


 const copyAll = () => {
  if (!project) return;

  // Convert the secrets to "KEY=VALUE" format
  const envString = project.secret
    .filter((item) => item.isActive) // include only active ones
    .map((item) => `${item.key}=${item.value}`)
    .join('\n');

  if (!envString) {
    toast.error("No active environment variables to copy");
    return;
  }

  // Try modern Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(envString)
      .then(() => toast.success("All env variables copied!"))
      .catch(() => fallbackCopy(envString));
  } else {
    fallbackCopy(envString);
  }
};

const fallbackCopy = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) toast.success("All env variables copied!");
    else toast.error("Failed to copy. Please copy manually.");
  } catch (err) {
    toast.error("Failed to copy. Please copy manually.");
  }

  document.body.removeChild(textArea);
};


  
  const removeProj = async (projectId: string) => {
  try {
    const message = await deleteProject(projectId); // call your API function
    if (message) {
      toast.success(message); // show success toast
      navigate('/')
    }
  } catch (error: any) {
    console.error("Error removing project:", error);
    toast.error(error.message || "Failed to remove project");
  }
};

  const changeName = async (projectId:string,name:string) => {
  
    try{
      if(!name)
      {
        return toast.error("Please Enter Project Name")
      }
      const res=await changeProjName(projectId,name)
      if(res)
      {
        setProject(prev=>({
          ...prev,
          name:name
        }))
        toast.success(res)
        setIsProjEdit(false)
        setProjEdit('')
      }
    }catch(error)
    {
        toast.error(error.response?.data?.message || "Something went wrong")
    }

  };


  return (
    <div className="flex justify-center items-center sm:px-10 px-2 h-[calc(100vh-4rem)] bg-gray-50">
      <div className="w-full p-4 sm:w-11/12 lg:w-11/12 sm:p-6 xl:w-3/5 shadow-lg shadow-gray-400 rounded-2xl bg-white 
                        transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl
                        sm:overflow-y-auto flex flex-col justify-center">
        <div className='flex justify-between'>
          <div>
            <div className='flex'>
              {
                isProjEdit ? (
                  <input value={projEdit} onChange={(e) => setProjEdit(e.target.value)} className="text-xl sm:text-2xl font-bold mb-2 w-52 h-11 box-border border-2 border-blue-600 px-2"></input>
                ) : (<h1 className="text-xl sm:text-2xl font-bold mb-2">{project.name}</h1>)
              }
              {!isProjEdit ? (
                <button
                  onClick={() => {setIsProjEdit(true)
                  setProjEdit(project.name)
                  }}
                  className='cursor-pointer text-sm ml-2 text-blue-500 hover:text-blue-600 cursor-pointer'
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={()=>changeName(project._id,projEdit)}
                  className='cursor-pointer text-sm ml-2 text-green-500 hover:text-green-600 cursor-pointer '
                >
                  Done
                </button>
              )}

            </div>
            <h2 className="text-gray-600 mb-4">Created At: {project.createdAt.split("T")[0]}</h2>
          </div>

          <div className='flex flex-col justify-end'>
            <button onClick={() => removeProj(project._id)}
              className="border border-black p-1 rounded-xl w-25 sm:w-36 mb-3 text-xs sm:text-sm bg-red-500 w-16 text-white cursor-pointer hover:bg-red-600"
            >
              Delete Project
            </button>
          </div>
        </div>


        <div ref={tableContainerRef} className="overflow-x-auto sm:max-h-64 border border-slate-400 rounded-lg  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full table-auto border-collapse border-slate-400">
            <thead className="bg-gray-200 sticky top-0 z-50 shadow-sm">
              <tr>
                <th className="border border-slate-300 px-2 sm:px-4 py-1 sm:py-2">Keys</th>
                <th className="border border-slate-300 px-2 sm:px-4 py-1 sm:py-2">Values</th>
                <th className="border border-slate-300 px-2 sm:px-4 py-1 sm:py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {project?.secret?.filter(item => item.isActive).map((item, index) => (
                <tr key={item._id || index}>
                  {/* Key Column */}
                  <td className="border border-slate-300 px-2 py-1">
                    {isEdit === item._id ? (
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        className="w-full border-2 border-blue-600 px-2"
                      />
                    ) : (
                      item.key
                    )}
                  </td>

                  {/* Value Column */}
                  <td className="border border-slate-300 px-2 py-1">
                    {isEdit === item._id ? (
                      <input
                        type="text"
                        value={valueInput}
                        onChange={(e) => setValueInput(e.target.value)}
                        className="w-full border-2 border-blue-600 px-2"
                      />
                    ) : (
                      item.value
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="border border-slate-300 px-2 py-1 flex gap-2 justify-center">
                    {isEdit === item._id ? (
                      <button
                        onClick={() => doneEdit(item._id,keyInput,valueInput)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 cursor-pointer"
                      >
                        Done
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(item.key, item.value,item._id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteKey(item._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {/* Add New Secret Row */}
              {showNewRow && (
                <tr>
                  <td className="border border-slate-300 px-2 py-1">
                    <input
                      type="text"
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      placeholder="Key"
                      className="w-full h-8 border-2 border-blue-500 px-2"
                    />
                  </td>
                  <td className="border border-slate-300 px-2 py-1">
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Value"
                      className="w-full h-8 border-2 border-blue-500 px-2"
                    />
                  </td>
                  <td className="border border-slate-300 px-2 py-1 flex gap-2 justify-center items-center">
                    <button
                      onClick={addEnvVar}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 cursor-pointer"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowNewRow(false);
                        setNewKey("");
                        setNewValue("");
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              )}
            </tbody>

          </table>


        </div>

        {/* btns section */}
        <div className='flex justify-end mt-5 gap-3'>

          <button
            className="bg-blue-500 text-white rounded-2xl w-9 h-9 cursor-pointer flex items-center justify-center hover:bg-blue-600"
            onClick={() => {
              setShowNewRow(true)
              setTimeout(() => {
                tableContainerRef.current?.scrollTo({
                  top: tableContainerRef.current.scrollHeight,
                  behavior: 'smooth',
                });
              }, 50);
            }}>
            +
          </button>
          <button className='p-1 border border-slate-400 bg-green-400 rounded-xl w-20 cursor-pointer active:bg-green-500' onClick={copyAll}>Copy All</button>

          <button className='p-1 border border-slate-400 rounded-xl hover:bg-gray-400 cursor-pointer' onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    </div>
  )
}

export default ViewProject
