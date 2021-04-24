import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  chakra,
  ChakraProvider,
  Container,
  extendTheme,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
  VStack,
} from "@chakra-ui/react";
import { Auth } from "@supabase/ui";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import JDLink from "../components/basics/JDLink";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/initSupabase";

const theme = extendTheme({
  fonts: {
    heading: "Work Sans, system-ui, sans-serif",
    body: "Work Sans, system-ui, sans-serif",
  },
});

function InnerApp({ Component, pageProps }) {
  const { user } = Auth.useUser();
  return (
    <div>
      <ChakraProvider theme={theme}>
        <VStack
          maxW={"3xl"}
          justify="space-between"
          height="100vh"
          width="100vw"
          maxWidth="100vw"
        >
          <JDHeader user={user} />
          {!user ? (
            <div>
              <Auth
                supabaseClient={supabase}
                providers={["google", "github"]}
                socialLayout="horizontal"
                socialButtonSize="xlarge"
              />
            </div>
          ) : (
            <Center>
              <Container as={Stack} width="100vw" maxWidth="1260px">
                <Component {...pageProps} user={supabase.auth.user()} />
              </Container>
            </Center>
          )}
          <Footer />
        </VStack>
      </ChakraProvider>
    </div>
  );
}

function BurgerMenu() {
  const Links = ["Dashboard", "Projects", "Team"];
  const router = useRouter();

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          variant="ghost"
          icon={<HamburgerIcon />}
          display={{ base: "inherit", md: "none" }}
          transition="all 0.2s"
          boxSize="67px"
          mt={6}
          mr={2}
          _focus={{ boxShadow: "outline" }}
        />
        <MenuList>
          <MenuItem onClick={(_) => router.push("/how-it-works")}>
            How it works
          </MenuItem>
          <MenuItem onClick={(_) => router.push("/pricing")}>Pricing</MenuItem>
          <MenuDivider />
          <MenuItem onClick={(_) => router.push("/create")}>Start Now</MenuItem>
          <MenuItem onClick={(_) => logout()}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}

async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) console.log("Error logging out:", error.message);
}

function JDHeader({ user }) {
  return (
    <HStack justify="space-between" width="100vw" maxWidth="1260px">
      <Logo />
      <BurgerMenu />
      <HStack spacing={5} pr={5} display={{ base: "none", md: "inherit" }}>
        <Navbar />
        {/* TODO: https://github.com/bijancn/justdecide/issues/32
               Need login and logout button with login button opening a login modal */}
        <JDLink href="/create">
          <Button colorScheme="red" variant="solid">
            Start now
          </Button>
        </JDLink>
        <Button
          onClick={async () => {
            logout();
          }}
        >
          {user ? "Logout" : "Login"}
        </Button>
      </HStack>
    </HStack>
  );
}

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>JustDecide</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {/* https://counter.dev/ */}
        <script
          dangerouslySetInnerHTML={{
            __html: ` if(!sessionStorage.getItem("_swa")&&document.referrer.indexOf(location.protocol+"//"+location.host)!== 0){fetch("https://counter.dev/track?"+new URLSearchParams({referrer:document.referrer,screen:screen.width+"x"+screen.height,user:"bijancn",utcoffset:"2"}))};sessionStorage.setItem("_swa","1"); `,
          }}
        />
        {/* https://hotjar.com */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:2362315,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `,
          }}
        />
      </Head>
      <Auth.UserContextProvider supabaseClient={supabase}>
        <InnerApp Component={Component} pageProps={pageProps}></InnerApp>
      </Auth.UserContextProvider>
    </div>
  );
}
