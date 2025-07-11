import { useContext} from "react";
import { AuthContext } from "../../components/AuthContext";

function Home() {
    const { user} = useContext(AuthContext);





    return (
        <div>
            <h1>Dashboard / Home</h1>
            {user && (
                <div>
                    <p>{user.email}</p>

                </div>
                
            )}
        
        </div>
    );
}

export default Home;
