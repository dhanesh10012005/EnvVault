import React, { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../context'
import { useContext } from 'react'
interface Project {
  id: string
  name: string
  createdAt: string
  env: { [key: string]: string }
}

const ViewProject: React.FC = () => {

  const tableContainerRef = useRef<HTMLDivElement | null>(null);

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
    return projects.find((p) => p.id === locationState.id) || null;
  });

  console.log(project)


  //  const {setProjects}=React.useContext(AppContext) as {setProjects:React.Dispatch<React.SetStateAction<Project[]>>}
  const [projEdit, setProjEdit] = useState<string | null>()
  const [isEdit, setIsEdit] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');


  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showNewRow, setShowNewRow] = useState(false);



  const { setProjects } = useContext(AppContext) as {
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  };

  const addEnvVar = () => {
    if (!newKey) return alert("Key cannot be empty");
    if (!project) return;

    const updatedEnv = { ...project.env, [newKey]: newValue };
    const updatedProject = { ...project, env: updatedEnv };
    setProject(updatedProject);

    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.id === project.id ? updatedProject : p))
    );

    // Reset inputs
    setNewKey('');
    setNewValue('');
    setShowNewRow(false);
  };

  const doneEdit = (editedKey: string) => {
    if (!project || !isEdit) return;

    // Create a new env object with the updated key/value
    const newEnv = { ...project.env };
    if (keyInput !== editedKey) {
      // If key was renamed
      newEnv[keyInput] = valueInput;
      delete newEnv[editedKey];
    } else {
      // Only value changed
      newEnv[editedKey] = valueInput;
    }

    // Update the project object
    const updatedProject = { ...project, env: newEnv };
    setProject(updatedProject);

    // Update context projects
    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.id === project.id ? updatedProject : p))
    );

    // Reset editing state
    setIsEdit(null);
    setKeyInput("");
    setValueInput("");
  };



  const startEdit = (key: string, val: string) => {
    setIsEdit(key);
    setKeyInput(key);
    setValueInput(val);
  }


  const deleteKey = (keyToDelete: string) => {
    if (!project) return;

    // Create new env object without the deleted key
    const newEnv = { ...project.env };
    delete newEnv[keyToDelete];

    // Update the project
    const updatedProject = { ...project, env: newEnv };
    setProject(updatedProject);

    // Update context projects
    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.id === project.id ? updatedProject : p))
    );
  };


  const copyAll = () => {
    if (!project) return;

    const envString = Object.entries(project.env)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(envString)
        .then(() => alert("All env variables copied!"))
        .catch(() => fallbackCopy(envString));
    } else {
      // Fallback for older / mobile browsers
      fallbackCopy(envString);
    }
  };

  // fallback function using a hidden <textarea>
  const fallbackCopy = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Move it off-screen
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) alert("All env variables copied!");
      else alert("Failed to copy. Please copy manually.");
    } catch (err) {
      alert("Failed to copy. Please copy manually.");
    }

    document.body.removeChild(textArea);
  };

  const deleteProj = () => {
    if (!project) return
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the project "${project.name}"?`
    )
    if (!confirmDelete) return

    setProjects((prevProjects) =>
      prevProjects.filter((p) => p.id !== project.id)
    )
    navigate('/') // Redirect to home
  }


  const changeName = () => {
    if (!project || !projEdit) return;

    // Update the local project
    const updatedProject = { ...project, name: projEdit };
    setProject(updatedProject);

    // Update the global projects context
    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.id === project.id ? updatedProject : p))
    );

    // Exit edit mode
    setProjEdit(null);
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
                projEdit ? (
                  <input value={projEdit} onChange={(e) => setProjEdit(e.target.value)} className="text-xl sm:text-2xl font-bold mb-2 w-52 h-11 box-border border-2 border-blue-600 px-2"></input>
                ) : (<h1 className="text-xl sm:text-2xl font-bold mb-2">{project.name}</h1>)

              }

              {!projEdit ? (
                <button
                  onClick={() => setProjEdit(project.name)}
                  className='cursor-pointer text-sm ml-2 text-blue-500 hover:text-blue-600'
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={changeName}
                  className='cursor-pointer text-sm ml-2 text-green-500 hover:text-green-600'
                >
                  Done
                </button>
              )}

            </div>
            <h2 className="text-gray-600 mb-4">Created At: {project.createdAt}</h2>
          </div>

          <div className='flex flex-col justify-end'>
            <button onClick={() => deleteProj()}
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
              {project?.secret?.map((item, index) => (
                <tr key={item._id || index}>
                  {/* Key Column */}
                  <td className="border border-slate-300 px-2 py-1">
                    {isEdit === item.key ? (
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
                    {isEdit === item.key ? (
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
                    {isEdit === item.key ? (
                      <button
                        onClick={() => doneEdit(item.key)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Done
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(item.key, item.value)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteKey(item.key)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowNewRow(false);
                        setNewKey("");
                        setNewValue("");
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
