import axios from "axios";
import React,{createContext,useState, ReactNode, useEffect} from "react"; 

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
}

export const AppContext=createContext<AppcContextType | null>(null)

interface AppProviderProps {
  children: ReactNode;
}



export const AppProvider:React.FC<AppProviderProps> = ({ children }) => {
    
    const [token,setToken]=useState<boolean>(false)
    const [projects,setProjects]=useState<Project[]>([ ]);


   useEffect(() => {
  axios.get("http://localhost:3000/projects/", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  .then((res) => setProjects(res.data.project))
  .catch((err) => console.error(err));
}, []);

    return (
        <AppContext.Provider value={{projects,setProjects,token,setToken}}>
          {children}
        </AppContext.Provider>
    )
}