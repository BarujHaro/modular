import { useContext} from "react";
import { AuthContext } from "../../components/AuthContext";

function Home() {
    const { user} = useContext(AuthContext);





    return (
        <div>
            <h1>Dashboard / Home</h1>
            {user && (
                <p>{user.email}</p>
            )}
        
        </div>
    );
}

export default Home;
