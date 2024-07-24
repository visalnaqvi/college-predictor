import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import data from "../data/data.js";
import { useState } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [formData, setFormData] = useState({
    course: "",
    marks: "",
    category: ""
  });
  const [filteredData, setFilteredData] = useState([]);
  const [allEligibleColleges, setAllEligibleColleges] = useState([]);
  const [flag, setFlag] = useState(false);

  function getUniqueCourses(data) {
    const courses = data.map(item => item.course);
    const uniqueCourses = [...new Set(courses)];
    return uniqueCourses;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { course, marks, category } = formData;
    const allEligible = data.filter(item => 
      (item[category] !== undefined ? item[category] <= parseFloat(marks) : item["ur"] <= parseFloat(marks))
    );
    let filtered = allEligible.filter(item => 
      item.course.toLowerCase() === course.toLowerCase() 
    );
    setFlag(true)
    setFilteredData(filtered);
    setAllEligibleColleges(allEligible);
  };

  return (
    <>
      <Head>
        <title>Stargate Education - College Predictor</title>
      </Head>
      <div className={styles.container}>
        {filteredData.length === 0 && allEligibleColleges.length === 0 && !flag && (
          <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="course">Select Course:</label>
                <select required id="course" name="course" value={formData.course} onChange={handleChange}>
                  <option value="">Select Course</option>
                  {
                    getUniqueCourses(data).map((d, i) => (
                      <option value={d} key={i}>{d}</option>
                    ))
                  }
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="marks">Enter Marks:</label>
                <input required type="number" id="marks" name="marks" value={formData.marks} onChange={handleChange} placeholder="Marks" />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Select Category:</label>
                <select required id="category" name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value="ur">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                  <option value="ews">EWS</option>
                  <option value="km">KM</option>
                  <option value="pwd">PwD</option>
                  <option value="sikh_minority">Sikh Minority</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        )}
        <div style={{display:"flex" , flexDirection:"column" , paddingBottom:"30px"}}>
        {
         flag && <div className={styles.formGroup}>
          <button onClick={() => {
            setFilteredData([]);
            setAllEligibleColleges([]);
            setFlag(false)
          }}>Edit Details</button>
        </div>
        }
        {flag && <div>{filteredData.length > 0 ? (
          <div className={styles.results}>
            <h3>Colleges for the selected course:</h3>
            <ul>
              {filteredData.map((item, index) => (
                <li key={index}>
                  {item.college} - {item.course} ({item[formData.category] !== undefined ? item[formData.category] : item["ur"]} marks)
                </li>
              ))}
            </ul>
          </div>
        ):<div className={styles.results}>
        <h3>Colleges for the selected course:</h3>
        <ul>
          
            <li>
              No Colleges Available for the selected course
            </li>
          
        </ul>
      </div>}</div>}
        {allEligibleColleges.length > 0 && (
          <div className={styles.results}>
            <h3>Courses and colleges that you can be eligible for:</h3>
            <ul>
              {allEligibleColleges.map((item, index) => (
                <li key={index}>
                  {item.college} - {item.course} ({item[formData.category] !== undefined ? item[formData.category] : item["ur"]} marks)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
