import axios from "axios";
import React,{createContext,useState, ReactNode, useEffect} from "react"; 
import API from "./apiClient";
import toast from "react-hot-toast";
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
    token:boolean,
    setToken:React.Dispatch<React.SetStateAction<boolean>>, 
    createProject: (name: string, secrets: ENV) => Promise<boolean>;
}

export const AppContext=createContext<AppcContextType | null>(null)

interface AppProviderProps {
  children: ReactNode;
}



export const AppProvider:React.FC<AppProviderProps> = ({ children }) => {
    
    const [token,setToken]=useState<boolean>(false)
    const [projects,setProjects]=useState<Project[]>([ ]);

    const createProject= async(name:string,secrets:ENV):Promise<any>=>{
      try{
       const res=await API.post('/projects/createproject',{name,secrets});

       const {project}=res.data;

       if(project) 
       {
        return project
       }
       else 
       {
        toast.error("failed to create project")
        return null
       }
      }
       catch(error)
       {
    toast.error(error.response?.data?.message || "Something went wrong");
    return null
       }

    }


   useEffect(() => {
  axios.get("http://localhost:3000/projects/", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  .then((res) => setProjects(res.data.project))
  .catch((err) => console.error(err));
}, []);

    return (
        <AppContext.Provider value={{projects,setProjects,token,setToken,createProject}}>
          {children}
        </AppContext.Provider>
    )
}