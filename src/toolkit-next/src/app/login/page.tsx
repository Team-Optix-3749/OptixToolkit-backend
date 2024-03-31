import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { AuthStates, getCurrentUser, signIn_emailPass } from "@/lib/firebase";
import { removeSession, validateSession } from "@/lib/session";
// import ThirdPartyLogins from "./thirdparty";

export default async function LoginForm() {
  const is_validSession = await validateSession();
  const exists_currentUser = !!getCurrentUser();

  if (is_validSession && exists_currentUser) {
    redirect("/");
  } else if (is_validSession && !exists_currentUser) {
    //find way to delete cookie
  }

  const onFormSubmit = async function (formData: FormData) {
    "use server";

    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    console.log(email, password);

    const res = await signIn_emailPass(email, password);

    switch (res) {
      case AuthStates.AUTHORIZED:
        redirect("/");
        break;
      case AuthStates.UNAUTHORIZED:
        break;
      default:
        break;
    }
  };

  return (
    <main className="w-full h-[99vh] flex justify-center items-center">
      {/* <Shennanigans /> */}
      <Card className="w-full max-w-sm z-10">
        <form action={onFormSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="email@gmail.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="password"
                required
              />
            </div>
            <div>
              {/* This has to be a client component and reveals config.ts. 
                  Possibly fix it in the future?  */}

              {/* <ThirdPartyLogins {...{toast}}/> */}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

// function Shennanigans() {
//   const DVD_SPEED = 2;

//   const [dvdData, SETdvdData] = useState({
//     x: 0,
//     y: 0,
//     invertedX: false,
//     invertedY: false
//   });
//   const [isDvdEnabled, SETisDvdEnabled] = useState(false);

//   const dvdLoop = function () {
//     let shouldInvertX = dvdData.invertedX;
//     let shouldInvertY = dvdData.invertedY;

//     if (dvdData.x + DVD_SPEED > window.innerWidth - 150 && !dvdData.invertedX) {
//       shouldInvertX = true;
//     }

//     if (
//       dvdData.y + DVD_SPEED > window.innerHeight - 280 &&
//       !dvdData.invertedY
//     ) {
//       shouldInvertY = true;
//     }

//     if (dvdData.x - DVD_SPEED < 0 && dvdData.invertedX) {
//       shouldInvertX = false;
//     }

//     if (dvdData.y - DVD_SPEED < 0 && dvdData.invertedY) {
//       shouldInvertY = false;
//     }

//     const deltaDvdY = (dvdData.invertedY ? -1 : 1) * DVD_SPEED;
//     const deltaDvdX = (dvdData.invertedX ? -1 : 1) * DVD_SPEED;

//     SETdvdData({
//       invertedX: shouldInvertX,
//       invertedY: shouldInvertY,
//       x: dvdData.x + deltaDvdX,
//       y: dvdData.y + deltaDvdY
//     });
//   };

//   if (isDvdEnabled) {
//     setTimeout(() => {
//       dvdLoop();
//     }, 100);
//   }

//   return (
//     <section>
//       <div
//         className="z-0 absolute w-[150px] h-min transition-500"
//         style={{
//           bottom: `${dvdData.y}px`,
//           left: `${dvdData.x}px`
//         }}
//         hidden={!isDvdEnabled}>
//         <img
//           src="/NoahSimon.jpeg"
//           width={150}
//           height={280}
//           className="rounded-xl border-2 border-primary"
//         />
//       </div>
//       <Button
//         className={
//           buttonVariants({ variant: "outline" }) + " absolute bottom-4 left-4"
//         }
//         onClick={() => SETisDvdEnabled(!isDvdEnabled)}>
//         Shennanigans
//       </Button>
//     </section>
//   );
// }
