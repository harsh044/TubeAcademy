import signupImg from "../assets/Images/signup.png"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <Template
      title="Join millions of learners mastering coding with Tube Academy – start your free learning journey today!"
      description1="Develop skills for today, prepare for tomorrow, and thrive in the future."
      description2="Empower your career with education designed to future-proof your success."
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup