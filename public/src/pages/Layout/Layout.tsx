import {useState} from "react";
import {Login} from "../Login";
import {Register} from "../Register";
import {Button, Container} from "@mui/material";

export function Layout(): JSX.Element {
    const [isLogin, setIsLogin] = useState<boolean>(false)

    return <Container maxWidth='sm'>

        {isLogin
            ? <Login/>
            : <Register/>
        }
        <Button
            variant='text'
            onClick={() => {
                setIsLogin(isLogin => !isLogin)
            }}
        >
            go to
            {
                isLogin
                    ? " register"
                    : " login"
            }
        </Button>
    </Container>
}