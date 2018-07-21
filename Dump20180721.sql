CREATE DATABASE  IF NOT EXISTS `dbsms2` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `dbsms2`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: dbsms2
-- ------------------------------------------------------
-- Server version	5.7.14

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tblannouncement`
--

DROP TABLE IF EXISTS `tblannouncement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblannouncement` (
  `intAnnounceId` int(11) NOT NULL,
  `strAUserId` varchar(20) NOT NULL,
  `strATitle` varchar(50) NOT NULL,
  `strAContent` text NOT NULL,
  `datDatePost` date NOT NULL,
  PRIMARY KEY (`intAnnounceId`),
  KEY `fk_user_announcement_idx` (`strAUserId`),
  CONSTRAINT `fk_user_announcement` FOREIGN KEY (`strAUserId`) REFERENCES `tblusers` (`strUserId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblannouncement`
--

LOCK TABLES `tblannouncement` WRITE;
/*!40000 ALTER TABLE `tblannouncement` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblannouncement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblbarangay`
--

DROP TABLE IF EXISTS `tblbarangay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblbarangay` (
  `intBarangayId` int(11) NOT NULL,
  `intBDistrictId` int(11) NOT NULL,
  `strBarangayName` varchar(45) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  PRIMARY KEY (`intBarangayId`),
  KEY `fk_dist_bara_idx` (`intBDistrictId`),
  CONSTRAINT `fk_dist_bara` FOREIGN KEY (`intBDistrictId`) REFERENCES `tbldistrict` (`intDistrictId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblbarangay`
--

LOCK TABLES `tblbarangay` WRITE;
/*!40000 ALTER TABLE `tblbarangay` DISABLE KEYS */;
INSERT INTO `tblbarangay` VALUES (1,1,'barangay test',0),(2,1,'Bagong Silang',1),(3,1,'Addition Hills',1),(4,1,'Barangka',1);
/*!40000 ALTER TABLE `tblbarangay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblbatch`
--

DROP TABLE IF EXISTS `tblbatch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblbatch` (
  `intBatchId` int(11) NOT NULL,
  `strBatchDesc` varchar(50) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  PRIMARY KEY (`intBatchId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='batch details';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblbatch`
--

LOCK TABLES `tblbatch` WRITE;
/*!40000 ALTER TABLE `tblbatch` DISABLE KEYS */;
INSERT INTO `tblbatch` VALUES (1,'Batch 2015',0),(2,'Batch 2015',1),(3,'Batch 2016',0);
/*!40000 ALTER TABLE `tblbatch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblbudget`
--

DROP TABLE IF EXISTS `tblbudget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblbudget` (
  `intBudgetId` int(11) NOT NULL,
  `strBUserId` varchar(20) NOT NULL,
  `dblAmount` double NOT NULL,
  `intSlots` int(11) NOT NULL,
  `datBudgetDate` date NOT NULL,
  PRIMARY KEY (`intBudgetId`),
  KEY `fk_budget_user_idx` (`strBUserId`),
  CONSTRAINT `fk_budget_user` FOREIGN KEY (`strBUserId`) REFERENCES `tblusers` (`strUserId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='budget Details';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblbudget`
--

LOCK TABLES `tblbudget` WRITE;
/*!40000 ALTER TABLE `tblbudget` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblbudget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblcourse`
--

DROP TABLE IF EXISTS `tblcourse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblcourse` (
  `intCourseId` int(11) NOT NULL,
  `strCourseName` varchar(60) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  PRIMARY KEY (`intCourseId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='course details';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcourse`
--

LOCK TABLES `tblcourse` WRITE;
/*!40000 ALTER TABLE `tblcourse` DISABLE KEYS */;
INSERT INTO `tblcourse` VALUES (1,'Bachelor of Science in Information Technology',1),(2,'Bachelor of Science in Computer Science',1);
/*!40000 ALTER TABLE `tblcourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbldistrict`
--

DROP TABLE IF EXISTS `tbldistrict`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbldistrict` (
  `intDistrictId` int(11) NOT NULL,
  `strDistrictName` varchar(20) NOT NULL,
  `isActive` tinyint(4) NOT NULL,
  PRIMARY KEY (`intDistrictId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbldistrict`
--

LOCK TABLES `tbldistrict` WRITE;
/*!40000 ALTER TABLE `tbldistrict` DISABLE KEYS */;
INSERT INTO `tbldistrict` VALUES (1,'District 1',1);
/*!40000 ALTER TABLE `tbldistrict` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbleducbg`
--

DROP TABLE IF EXISTS `tbleducbg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbleducbg` (
  `intEducBGId` int(11) NOT NULL,
  `strEBGStudId` varchar(20) NOT NULL,
  `strSchoolName` varchar(60) NOT NULL,
  `enumSchoolSector` enum('public','private') NOT NULL,
  PRIMARY KEY (`intEducBGId`),
  KEY `fk_studentdet_educbg_idx` (`strEBGStudId`),
  CONSTRAINT `fk_studentdet_educbg` FOREIGN KEY (`strEBGStudId`) REFERENCES `tblstudentdetails` (`strStudentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbleducbg`
--

LOCK TABLES `tbleducbg` WRITE;
/*!40000 ALTER TABLE `tbleducbg` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbleducbg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblgradedetails`
--

DROP TABLE IF EXISTS `tblgradedetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblgradedetails` (
  `intGradDetId` int(11) NOT NULL,
  `intGDGradesId` int(11) NOT NULL,
  `strGDSubject` varchar(45) NOT NULL,
  `intGDUnits` tinyint(4) NOT NULL,
  `strGDGrade` varchar(5) NOT NULL,
  PRIMARY KEY (`intGradDetId`),
  KEY `fk_grdet_grades_idx` (`intGDGradesId`),
  CONSTRAINT `fk_grdet_grades` FOREIGN KEY (`intGDGradesId`) REFERENCES `tblgrades` (`intGradesId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='grade details';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblgradedetails`
--

LOCK TABLES `tblgradedetails` WRITE;
/*!40000 ALTER TABLE `tblgradedetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblgradedetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblgrades`
--

DROP TABLE IF EXISTS `tblgrades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblgrades` (
  `intGradesId` int(11) NOT NULL,
  `intGGradingId` int(11) NOT NULL,
  `strGStudentId` varchar(20) NOT NULL,
  `strYear` char(1) NOT NULL,
  `strTerm` char(1) NOT NULL,
  `strGCopy` blob NOT NULL,
  PRIMARY KEY (`intGradesId`),
  KEY `fk_grades_grading_idx` (`intGGradingId`),
  KEY `fk_grades_student_idx` (`strGStudentId`),
  CONSTRAINT `fk_grades_grading` FOREIGN KEY (`intGGradingId`) REFERENCES `tblgrading` (`intGradingId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_grades_stud` FOREIGN KEY (`strGStudentId`) REFERENCES `tblstudentdetails` (`strStudentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='table grades';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblgrades`
--

LOCK TABLES `tblgrades` WRITE;
/*!40000 ALTER TABLE `tblgrades` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblgrades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblgrading`
--

DROP TABLE IF EXISTS `tblgrading`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblgrading` (
  `intGradingId` int(11) NOT NULL,
  `strGradingDesc` varchar(20) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  PRIMARY KEY (`intGradingId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblgrading`
--

LOCK TABLES `tblgrading` WRITE;
/*!40000 ALTER TABLE `tblgrading` DISABLE KEYS */;
INSERT INTO `tblgrading` VALUES (1,'test 1',1);
/*!40000 ALTER TABLE `tblgrading` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblgradingdetails`
--

DROP TABLE IF EXISTS `tblgradingdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblgradingdetails` (
  `intGradingDetId` int(11) NOT NULL,
  `intGradingId` int(11) NOT NULL,
  `strGrade` varchar(5) NOT NULL,
  `strGradeStatus` char(1) NOT NULL,
  PRIMARY KEY (`intGradingDetId`),
  KEY `fk_details_grading_idx` (`intGradingId`),
  CONSTRAINT `fk_details_grading` FOREIGN KEY (`intGradingId`) REFERENCES `tblgrading` (`intGradingId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblgradingdetails`
--

LOCK TABLES `tblgradingdetails` WRITE;
/*!40000 ALTER TABLE `tblgradingdetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblgradingdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblmessage`
--

DROP TABLE IF EXISTS `tblmessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblmessage` (
  `intMessageId` int(11) NOT NULL,
  `strMUserId` varchar(20) NOT NULL,
  `strMSubject` varchar(30) NOT NULL,
  `strMContent` text NOT NULL,
  `datMDate` date NOT NULL,
  PRIMARY KEY (`intMessageId`),
  KEY `fk_message_user_idx` (`strMUserId`),
  CONSTRAINT `fk_message_user` FOREIGN KEY (`strMUserId`) REFERENCES `tblusers` (`strUserId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblmessage`
--

LOCK TABLES `tblmessage` WRITE;
/*!40000 ALTER TABLE `tblmessage` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblmessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblparentsinfo`
--

DROP TABLE IF EXISTS `tblparentsinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblparentsinfo` (
  `intParentId` int(11) NOT NULL,
  `strPStudentId` varchar(20) NOT NULL,
  `strParentName` varchar(60) NOT NULL,
  `strParentAdress` varchar(80) NOT NULL,
  `strParentOccupation` varchar(40) NOT NULL,
  `strParentEducAttain` varchar(30) NOT NULL,
  PRIMARY KEY (`intParentId`),
  KEY `fk_parent_student_idx` (`strPStudentId`),
  CONSTRAINT `fk_parent_student` FOREIGN KEY (`strPStudentId`) REFERENCES `tblstudentdetails` (`strStudentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='information of the student''s parents';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblparentsinfo`
--

LOCK TABLES `tblparentsinfo` WRITE;
/*!40000 ALTER TABLE `tblparentsinfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblparentsinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblrequirements`
--

DROP TABLE IF EXISTS `tblrequirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblrequirements` (
  `intRequirementId` int(11) NOT NULL,
  `strRequirementDesc` varchar(40) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  PRIMARY KEY (`intRequirementId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='list of requirements';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblrequirements`
--

LOCK TABLES `tblrequirements` WRITE;
/*!40000 ALTER TABLE `tblrequirements` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblrequirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblschcour`
--

DROP TABLE IF EXISTS `tblschcour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblschcour` (
  `intSCId` int(11) NOT NULL,
  `intSCSchoolId` int(11) NOT NULL,
  `intSCCourseId` int(11) NOT NULL,
  `strYears` char(1) NOT NULL,
  `strTerms` char(1) NOT NULL,
  PRIMARY KEY (`intSCId`),
  KEY `fk_schcour_school_idx` (`intSCSchoolId`),
  KEY `fk_schcour_course_idx` (`intSCCourseId`),
  CONSTRAINT `fk_schcour_course` FOREIGN KEY (`intSCCourseId`) REFERENCES `tblcourse` (`intCourseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_schcour_school` FOREIGN KEY (`intSCSchoolId`) REFERENCES `tblschool` (`intSchoolId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblschcour`
--

LOCK TABLES `tblschcour` WRITE;
/*!40000 ALTER TABLE `tblschcour` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblschcour` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblscholarshiptype`
--

DROP TABLE IF EXISTS `tblscholarshiptype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblscholarshiptype` (
  `intSTId` int(11) NOT NULL,
  `strSTDesc` varchar(30) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  PRIMARY KEY (`intSTId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblscholarshiptype`
--

LOCK TABLES `tblscholarshiptype` WRITE;
/*!40000 ALTER TABLE `tblscholarshiptype` DISABLE KEYS */;
INSERT INTO `tblscholarshiptype` VALUES (1,'Special',1);
/*!40000 ALTER TABLE `tblscholarshiptype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblschool`
--

DROP TABLE IF EXISTS `tblschool`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblschool` (
  `intSchoolId` int(11) NOT NULL,
  `intSGradingId` int(11) NOT NULL,
  `strSchoolName` varchar(60) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  PRIMARY KEY (`intSchoolId`),
  KEY `fk_school_grading_idx` (`intSGradingId`),
  CONSTRAINT `fk_school_grading` FOREIGN KEY (`intSGradingId`) REFERENCES `tblgrading` (`intGradingId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblschool`
--

LOCK TABLES `tblschool` WRITE;
/*!40000 ALTER TABLE `tblschool` DISABLE KEYS */;
INSERT INTO `tblschool` VALUES (1,1,'University of the Philippines',1),(2,1,'Polytechnic University of the Philippines',1),(3,1,'University of Mandaluyong',1);
/*!40000 ALTER TABLE `tblschool` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblstudentdetails`
--

DROP TABLE IF EXISTS `tblstudentdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblstudentdetails` (
  `strStudentId` varchar(20) NOT NULL,
  `intSBarangayId` int(11) NOT NULL,
  `strStudentLname` varchar(20) NOT NULL,
  `strStudentFname` varchar(25) NOT NULL,
  `strStudentMname` varchar(20) DEFAULT NULL,
  `strStudentBday` date NOT NULL,
  `strStudentBplace` varchar(40) NOT NULL,
  `strStudentHouseNo` tinyint(4) NOT NULL,
  `strStudentStreet` varchar(30) NOT NULL,
  `strStudentZipCode` varchar(8) NOT NULL,
  `enumStudentGender` enum('male','female') NOT NULL,
  `strStudentCitizenship` varchar(20) NOT NULL,
  `strStudentMobNum` varchar(15) NOT NULL,
  `strStudentEmail` varchar(40) NOT NULL,
  `strStudentFIncome` double NOT NULL,
  `intStudentSibs` tinyint(4) NOT NULL,
  `enumStudentStat` enum('applicant','scholar') NOT NULL,
  PRIMARY KEY (`strStudentId`),
  KEY `fk_student_barangay_idx` (`intSBarangayId`),
  CONSTRAINT `fk_student_barangay` FOREIGN KEY (`intSBarangayId`) REFERENCES `tblbarangay` (`intBarangayId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_student_user` FOREIGN KEY (`strStudentId`) REFERENCES `tblusers` (`strUserId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='student details';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblstudentdetails`
--

LOCK TABLES `tblstudentdetails` WRITE;
/*!40000 ALTER TABLE `tblstudentdetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblstudentdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbluserannouncement`
--

DROP TABLE IF EXISTS `tbluserannouncement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbluserannouncement` (
  `intUAId` int(11) NOT NULL,
  `strUAUserId` varchar(20) NOT NULL,
  `intUAAId` int(11) NOT NULL,
  `isRead` tinyint(1) NOT NULL,
  PRIMARY KEY (`intUAId`),
  KEY `fk_UA_A_idx` (`intUAAId`),
  KEY `fk_UA_user_idx` (`strUAUserId`),
  CONSTRAINT `fk_UA_A` FOREIGN KEY (`intUAAId`) REFERENCES `tblannouncement` (`intAnnounceId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_UA_user` FOREIGN KEY (`strUAUserId`) REFERENCES `tblusers` (`strUserId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbluserannouncement`
--

LOCK TABLES `tbluserannouncement` WRITE;
/*!40000 ALTER TABLE `tbluserannouncement` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbluserannouncement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblusercourse`
--

DROP TABLE IF EXISTS `tblusercourse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblusercourse` (
  `intUCId` int(11) NOT NULL,
  `strUserId` varchar(20) NOT NULL,
  `intUCCourseId` int(11) NOT NULL,
  PRIMARY KEY (`intUCId`),
  KEY `fk_user_Ucourse_idx` (`strUserId`),
  KEY `fk_course_Ucourse_idx` (`intUCCourseId`),
  CONSTRAINT `fk_course_Ucourse` FOREIGN KEY (`intUCCourseId`) REFERENCES `tblcourse` (`intCourseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_Ucourse` FOREIGN KEY (`strUserId`) REFERENCES `tblusers` (`strUserId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblusercourse`
--

LOCK TABLES `tblusercourse` WRITE;
/*!40000 ALTER TABLE `tblusercourse` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblusercourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblusermessages`
--

DROP TABLE IF EXISTS `tblusermessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblusermessages` (
  `intUMId` int(11) NOT NULL,
  `intUMMessageId` int(11) NOT NULL,
  `strUMUserId` varchar(20) NOT NULL,
  `isRead` tinyint(1) NOT NULL,
  PRIMARY KEY (`intUMId`),
  KEY `fk_um_idx` (`intUMMessageId`),
  KEY `fk_um_user_idx` (`strUMUserId`),
  CONSTRAINT `fk_um_message` FOREIGN KEY (`intUMMessageId`) REFERENCES `tblmessage` (`intMessageId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_um_user` FOREIGN KEY (`strUMUserId`) REFERENCES `tblusers` (`strUserId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblusermessages`
--

LOCK TABLES `tblusermessages` WRITE;
/*!40000 ALTER TABLE `tblusermessages` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblusermessages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbluserrequirements`
--

DROP TABLE IF EXISTS `tbluserrequirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbluserrequirements` (
  `intURId` int(11) NOT NULL,
  `strURUserId` varchar(20) NOT NULL,
  `intURRId` int(11) NOT NULL,
  `datDatePassed` date NOT NULL,
  PRIMARY KEY (`intURId`),
  KEY `fk_UR_req_idx` (`intURRId`),
  KEY `fk_UR_user_idx` (`strURUserId`),
  CONSTRAINT `fk_UR_req` FOREIGN KEY (`intURRId`) REFERENCES `tblrequirements` (`intRequirementId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_UR_user` FOREIGN KEY (`strURUserId`) REFERENCES `tblusers` (`strUserId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbluserrequirements`
--

LOCK TABLES `tbluserrequirements` WRITE;
/*!40000 ALTER TABLE `tbluserrequirements` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbluserrequirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblusers`
--

DROP TABLE IF EXISTS `tblusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblusers` (
  `strUserId` varchar(20) NOT NULL,
  `intBatchId` int(11) NOT NULL,
  `intSchTypeId` int(11) NOT NULL,
  `strUserEmail` varchar(40) NOT NULL,
  `strUserPassword` varchar(25) NOT NULL,
  `enumUserType` enum('admin','user') NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  PRIMARY KEY (`strUserId`),
  KEY `fk_batch_user_idx` (`intBatchId`),
  KEY `fk_stype_user_idx` (`intSchTypeId`),
  CONSTRAINT `fk_batch_user` FOREIGN KEY (`intBatchId`) REFERENCES `tblbatch` (`intBatchId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_stype_user` FOREIGN KEY (`intSchTypeId`) REFERENCES `tblscholarshiptype` (`intSTId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblusers`
--

LOCK TABLES `tblusers` WRITE;
/*!40000 ALTER TABLE `tblusers` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblusers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbluserschool`
--

DROP TABLE IF EXISTS `tbluserschool`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbluserschool` (
  `intUSchId` int(11) NOT NULL,
  `strUSUserId` varchar(20) NOT NULL,
  `intUSSchoolId` int(11) NOT NULL,
  PRIMARY KEY (`intUSchId`),
  KEY `fk_user_user-school_idx` (`strUSUserId`),
  KEY `fk_school_user-school_idx` (`intUSSchoolId`),
  CONSTRAINT `fk_school_usch` FOREIGN KEY (`intUSSchoolId`) REFERENCES `tblschool` (`intSchoolId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_USch` FOREIGN KEY (`strUSUserId`) REFERENCES `tblusers` (`strUserId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Scholar''s school';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbluserschool`
--

LOCK TABLES `tbluserschool` WRITE;
/*!40000 ALTER TABLE `tbluserschool` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbluserschool` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-07-21 15:04:25
