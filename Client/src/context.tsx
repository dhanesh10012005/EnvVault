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
    setProjects:React.Dispatch<React.SetStateAction<Project[]>>
}

export const AppContext=createContext<AppcContextType | null>(null)

interface AppProviderProps {
  children: ReactNode;
}



export const AppProvider:React.FC<AppProviderProps> = ({ children }) => {

    const [projects,setProjects]=useState<Project[]>([
      {
    id: "proj-001",
    name: "Portfolio Website",
    createdAt: "2025-03-12",
    env: {
      API_URL: "https://api.portfolio.dev",
      NODE_ENV: "development",
      DB_USER: "portfolio_admin",
      DB_PASS: "secure123",
    },
  },
  {
    id: "proj-002",
    name: "E-Commerce App",
    createdAt: "2025-04-08",
    env: {
      API_URL: "https://api.shopapp.com",
      NODE_ENV: "production",
      STRIPE_KEY: "sk_live_abc123",
      DB_URL: "postgres://shop_admin:password@db.shopapp.com",
    },
  },
  {
    id: "proj-003",
    name: "Chat Application",
    createdAt: "2025-05-20",
    env: {
      SOCKET_SERVER: "wss://chatapp.live",
      NODE_ENV: "production",
      REDIS_URL: "redis://chat-cache:6379",
      AUTH_SECRET: "jwt_super_secret",
    },
  },
  {
    id: "proj-004",
    name: "Task Manager",
    createdAt: "2025-06-14",
    env: {
      API_URL: "https://tasks.api.io",
      NODE_ENV: "staging",
      DB_USER: "task_user",
      DB_PASS: "pass@123",
      FEATURE_FLAG: "true",
    },
  },
  {
    id: "proj-005",
    name: "Fitness Tracker",
    createdAt: "2025-07-25",
    env: {
      API_URL: "https://fittrack.api",
      NODE_ENV: "development",
      ANALYTICS_KEY: "fit123analytics",
      STORAGE_BUCKET: "fittrack-user-data",
    },
  },
    {
  id: "proj-006",
  name: "Recipe Finder",
  createdAt: "2025-08-10",
  env: {
    API_URL: "https://api.recipefinder.com",
    NODE_ENV: "production",
    DB_USER: "recipe_admin",
    DB_PASS: "recipe123",
    RECIPE_KEY: "rf_abc123",
  },
},
{
  id: "proj-007",
  name: "Movie Tracker",
  createdAt: "2025-09-05",
  env: {
    API_URL: "https://api.movietracker.dev",
    NODE_ENV: "development",
    DB_USER: "movie_user",
    DB_PASS: "movie456",
    ANALYTICS_KEY: "mt_analytics_789",
  },
},
    ]);


 useEffect(()=>{

},[projects])

    return (
        <AppContext.Provider value={{projects,setProjects}}>
          {children}
        </AppContext.Provider>
    )
}