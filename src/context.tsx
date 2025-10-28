import axios from "axios";
import React,{createContext,useState, ReactNode, useEffect, useContext} from "react"; 
import API from "./apiClient";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";
type ENV={
    [key:string]:string
}


export interface Project{
    id:string,
    name:string,
    createdAt:string,
    env:ENV,
}

interface AppcContextType{
    projects:Project[],
    setProjects:React.Dispatch<React.SetStateAction<Project[]>>,
    createProject: (name: string, secret: ENV) => Promise<any>;
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
    const res = await API.post('/projects/createproject', { name, secret });
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




    useEffect(() => {
  API.get("/projects/")
    .then((res) => {
      setProjects(res.data.project);
      console.log(res.data.project);
    })
    .catch((err) => {
      console.error(err);
      setProjects([]);
    });
}, [token]);


    return (
        <AppContext.Provider value={{projects,setProjects,createProject}}>
          {children}
        </AppContext.Provider>
    )
}