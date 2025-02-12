import { FC, ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface Props {
    children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
    return (
        <>
            <div className="bg-gypsum font-DM">
                <Header />
                <div className="m-2">
                    {children}
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Layout;
