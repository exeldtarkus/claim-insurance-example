import { useRouter } from "next/navigation";

const useRedirectPage = () => {
  const router = useRouter();

  const ReuseRedirectPage = (link:string) => {
    router.push(link);
  };

  return ReuseRedirectPage;
};

export default useRedirectPage;
