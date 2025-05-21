import AIAgent from "@/components/AIAgent";

const Page = () => {
    return (
        <>
            <h3>Interview Generation</h3>

            <AIAgent userName="you" userId="user1" type="generate"/>
        </>
    )
}
export default Page
