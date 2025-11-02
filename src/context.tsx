import axios from "axios";
import React,{createContext,useState, ReactNode, useEffect, useContext} from "react"; 
import API from "./apiClient";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";


export interface Secret {
  _id: string;
  key: string;
  value: string;
  isActive?: boolean;
}


export interface Project{   
    _id:string,
    name:string,
    createdAt:string,
     secret: Secret[];
}

interface AppcContextType{
    projects:Project[],
    setProjects:React.Dispatch<React.SetStateAction<Project[]>>,
    createProject: (name: string, secret: Secret) => Promise<any>,
    deleteProject:(projectId:string)=>Promise<any>,
    changeProjName:(projectId:string,name:string)=>Promise<any>
    editEnv:(projectId:string,envId:string,editedKey:string,editedValue:string)=>Promise<any>
    deleteEnv:(projectId:string,envId:string)=>Promise<any>,
    addEnv:(projectId:string,key:string,value:string)=>Promise<any>
}

export const AppContext=createContext<AppcContextType | null>(null)

interface AppProviderProps {
  children: ReactNode;
}



export const AppProvider:React.FC<AppProviderProps> = ({ children }) => {
    
    const [projects,setProjects]=useState<Project[]>([]);
    const {token}=useContext(AuthContext)

  const createProject = async (name: string, secret: { key: string; value: string }[]): Promise<any> => {
  try {
    const res = await API.post('/projects/', { name, secret });
    const { project } = res.data;

    if (project) {
      return project;
    } else {
      toast.error("Failed to create project");
      return null;
    }
  } catch (error: any) {
    const message = error.response?.data?.message;
    throw new Error(message); // <--- Important: rethrow to stop execution in saveProject
  }
};

 
const deleteProject = async (projectId: string) => {
  try {
    const res = await API.delete(`/projects/${projectId}`);

    if (res.status === 200) {
       setProjects((prev) => prev.filter((p) => p._id !== projectId));
       return res.data.message;
    }
  } catch (error: any) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

const changeProjName=async (projectId:string,name:string)=>{
     try{
       const res=await API.patch(`/projects/${projectId}`,{name})
       if(res.status===200)
       {
        setProjects(prev =>
        prev.map(p => (p._id === projectId ? { ...p, name } : p)));
        return res.data.message;
       }
     }catch(error:any)
     {
          return error;
     }
}

const editEnv=async(projectId:string,envId:string,editedKey:string,editedValue:string)=>
{
    try{
       const res=await API.patch(`/projects/${projectId}/${envId}`,{ key: editedKey, value: editedValue })
       if(res.status===200)
       {
         setProjects(prev=>
          prev.map(p=>p._id===projectId?res.data.project:p)
        )
         return res.data;
       }
    }
    catch(error:any)
    {
        throw error;
    }

}

const deleteEnv = async (projectId: string, secretId: string) => {
  try {
    const res = await API.delete(`/projects/${projectId}/${secretId}`);
    if (res.status === 200) {
      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId
            ? { ...p, secret: p.secret.filter((s) => s._id !==secretId) }
            : p
        )
      );
      return res.data.message;
    }
  } catch (error: any) {
    throw error;
  }
};


const addEnv = async (projectId: string, key: string, value: string) => {
  try {
    const res = await API.post(`projects/${projectId}`, { key, value });
    if (res.status === 200) {
      const updatedProject = res.data.project;

      setProjects(prev =>
        prev.map(p => (p && p._id === projectId ? updatedProject : p))
      );
      return updatedProject;
    }
  } catch (error: any) {
    throw error;
  }
};


    useEffect(() => {
  API.get("/projects/")
    .then((res) => {
      setProjects(res.data.project||[]);
      console.log(res.data.project);
    })
    .catch((err) => {
      console.error(err);
      setProjects([]);
    });
}, [token]);

 
    return (
        <AppContext.Provider value={{projects,setProjects,createProject,deleteProject,changeProjName,editEnv,deleteEnv,addEnv}}>
          {children}
        </AppContext.Provider>
    )
}