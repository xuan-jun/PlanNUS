import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../variants.ts";
import "../pages/Landing/Landing.css"

const TextContainer = () => {
  return (
    <body>
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* upper */}
      <div>
        <motion.span variants={fadeIn()} className="bubble-left">
        <p><strong>Instructors!</strong> <br /> Have you wondered whether your students are 
          having <br /> assignments on days where you have provided assignments?</p> 
        </motion.span>
        <motion.span variants={fadeIn()} className="bubble-right">
        <p><strong>Students!</strong>  <br /> Have you wondered about how the assignment <br /> workloads are like
        for the previous semester?</p>
        </motion.span>
      </div>
    </motion.div>
    </body>
  );
};

export default TextContainer;