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
-- ORDER BY:  `intAnnounceId`

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
  UNIQUE KEY `strDisBar_UNIQUE` (`intBDistrictId`,`strBarangayName`),
  KEY `fk_dist_bara_idx` (`intBDistrictId`),
  CONSTRAINT `fk_dist_bara` FOREIGN KEY (`intBDistrictId`) REFERENCES `tbldistrict` (`intDistrictId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblbarangay`
--
-- ORDER BY:  `intBarangayId`

LOCK TABLES `tblbarangay` WRITE;
/*!40000 ALTER TABLE `tblbarangay` DISABLE KEYS */;
INSERT INTO `tblbarangay` VALUES (2,1,'Bagong Silang',1),(4,1,'Barangka',1),(5,2,'Brgy. Tumana',1),(6,1,'barangay test',1);
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
  PRIMARY KEY (`intBatchId`),
  UNIQUE KEY `strBatchDesc_UNIQUE` (`strBatchDesc`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='batch details';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblbatch`
--
-- ORDER BY:  `intBatchId`

LOCK TABLES `tblbatch` WRITE;
/*!40000 ALTER TABLE `tblbatch` DISABLE KEYS */;
INSERT INTO `tblbatch` VALUES (1,'Batch 2018',1),(2,'Batch 2017',1);
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
  `intBSTId` int(11) NOT NULL,
  `dblAmount` double NOT NULL,
  `dblExcessAmt` double NOT NULL,
  `intSlots` int(11) NOT NULL,
  `datBudgetDate` date NOT NULL,
  `enumBudgetStatus` enum('pending','approved','expired') NOT NULL,
  PRIMARY KEY (`intBudgetId`),
  KEY `fk_budget_type_idx` (`intBSTId`),
  CONSTRAINT `fk_budget_type` FOREIGN KEY (`intBSTId`) REFERENCES `tblscholarshiptype` (`intSTId`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='budget Details';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblbudget`
--
-- ORDER BY:  `intBudgetId`

LOCK TABLES `tblbudget` WRITE;
/*!40000 ALTER TABLE `tblbudget` DISABLE KEYS */;
INSERT INTO `tblbudget` VALUES (1,1,12000,0,1,'2018-08-23','approved');
/*!40000 ALTER TABLE `tblbudget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblclaim`
--

DROP TABLE IF EXISTS `tblclaim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblclaim` (
  `intClaimId` int(11) NOT NULL,
  `intCStudId` int(11) NOT NULL,
  `datDateClaimed` date DEFAULT NULL,
  `enumBudget` enum('First','Second') NOT NULL,
  `isYear` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`intClaimId`),
  KEY `fk_student_claim_idx` (`intCStudId`),
  CONSTRAINT `fk_student_claim` FOREIGN KEY (`intCStudId`) REFERENCES `tblstudentdetails` (`intStudentId`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblclaim`
--
-- ORDER BY:  `intClaimId`

LOCK TABLES `tblclaim` WRITE;
/*!40000 ALTER TABLE `tblclaim` DISABLE KEYS */;
INSERT INTO `tblclaim` VALUES (1,1,'2018-08-23','First',1);
/*!40000 ALTER TABLE `tblclaim` ENABLE KEYS */;
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
  PRIMARY KEY (`intCourseId`),
  UNIQUE KEY `strCourseName_UNIQUE` (`strCourseName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='course details';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcourse`
--
-- ORDER BY:  `intCourseId`

LOCK TABLES `tblcourse` WRITE;
/*!40000 ALTER TABLE `tblcourse` DISABLE KEYS */;
INSERT INTO `tblcourse` VALUES (1,'Bachelor of Science in Information Technology',1),(2,'Bachelor of Science in Computer Science',1),(3,'Bachelor of Science in Accounting',1),(4,'Bachelor of Science in Hospitality Management',1),(5,'blob',0),(6,'Bachelor of Political Science',1),(7,'undefined',0);
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
  PRIMARY KEY (`intDistrictId`),
  UNIQUE KEY `strDistrictName_UNIQUE` (`strDistrictName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbldistrict`
--
-- ORDER BY:  `intDistrictId`

LOCK TABLES `tbldistrict` WRITE;
/*!40000 ALTER TABLE `tbldistrict` DISABLE KEYS */;
INSERT INTO `tbldistrict` VALUES (1,'District 1',1),(2,'District 2',1),(3,'District 3',1),(4,'District 4',1),(5,'District 5',1);
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
  `intEBGStudId` int(11) NOT NULL,
  `strEBGSchoolName` varchar(120) NOT NULL,
  `enumSchoolSector` enum('public','private') NOT NULL,
  `dblEducGA` double NOT NULL,
  `dblEducEng` double DEFAULT '0',
  `dblEducSci` double DEFAULT '0',
  `dblEducMth` double DEFAULT '0',
  PRIMARY KEY (`intEducBGId`),
  KEY `fk_bg_student_idx` (`intEBGStudId`),
  CONSTRAINT `fk_bg_student` FOREIGN KEY (`intEBGStudId`) REFERENCES `tblstudentdetails` (`intStudentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbleducbg`
--
-- ORDER BY:  `intEducBGId`

LOCK TABLES `tbleducbg` WRITE;
/*!40000 ALTER TABLE `tbleducbg` DISABLE KEYS */;
INSERT INTO `tbleducbg` VALUES (1,1,'Quezon City High School','public',90,80,90,85),(2,2,'Quezon City High School','public',1.5,0,0,0);
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
-- ORDER BY:  `intGradDetId`

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
  KEY `fk_grades_user_idx` (`strGStudentId`),
  CONSTRAINT `fk_grades_grading` FOREIGN KEY (`intGGradingId`) REFERENCES `tblgrading` (`intGradingId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_grades_user` FOREIGN KEY (`strGStudentId`) REFERENCES `tblusers` (`strUserId`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='table grades';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblgrades`
--
-- ORDER BY:  `intGradesId`

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
  PRIMARY KEY (`intGradingId`),
  UNIQUE KEY `strGradingDesc_UNIQUE` (`strGradingDesc`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblgrading`
--
-- ORDER BY:  `intGradingId`

LOCK TABLES `tblgrading` WRITE;
/*!40000 ALTER TABLE `tblgrading` DISABLE KEYS */;
INSERT INTO `tblgrading` VALUES (1,'PUP',1);
/*!40000 ALTER TABLE `tblgrading` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblgradingdetails`
--

DROP TABLE IF EXISTS `tblgradingdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblgradingdetails` (
  `intGradingDetId` int(11) NOT NULL AUTO_INCREMENT,
  `intGradingId` int(11) NOT NULL,
  `strGrade` varchar(5) NOT NULL,
  `enumGradeStatus` enum('P','F','INC','W','D') NOT NULL,
  PRIMARY KEY (`intGradingDetId`),
  KEY `fk_details_grading_idx` (`intGradingId`),
  CONSTRAINT `fk_details_grading` FOREIGN KEY (`intGradingId`) REFERENCES `tblgrading` (`intGradingId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblgradingdetails`
--
-- ORDER BY:  `intGradingDetId`

LOCK TABLES `tblgradingdetails` WRITE;
/*!40000 ALTER TABLE `tblgradingdetails` DISABLE KEYS */;
INSERT INTO `tblgradingdetails` VALUES (8,1,'1.0','P'),(9,1,'1.25','P'),(10,1,'1.5','P'),(11,1,'1.75','P'),(12,1,'2.0','P'),(13,1,'2.25','P'),(14,1,'2.5','P'),(15,1,'2.75','P'),(16,1,'3.0','P'),(17,1,'5.0','F'),(18,1,'INC','INC'),(19,1,'W','W'),(20,1,'D','D');
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
-- ORDER BY:  `intMessageId`

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
  `intPStudentId` int(11) NOT NULL,
  `strParentName` varchar(60) NOT NULL,
  `strParentAddress` varchar(120) NOT NULL,
  `strParentOccupation` varchar(40) NOT NULL,
  `strParentEducAttain` varchar(30) NOT NULL,
  PRIMARY KEY (`intParentId`),
  KEY `fk_PI_student_idx` (`intPStudentId`),
  CONSTRAINT `fk_PI_student` FOREIGN KEY (`intPStudentId`) REFERENCES `tblstudentdetails` (`intStudentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='information of the student''s parents';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblparentsinfo`
--
-- ORDER BY:  `intParentId`

LOCK TABLES `tblparentsinfo` WRITE;
/*!40000 ALTER TABLE `tblparentsinfo` DISABLE KEYS */;
INSERT INTO `tblparentsinfo` VALUES (1,1,'Cons Tolentino','54 E Sgt. Esguerra Ave. Q.C','Driver','Vocational'),(2,2,'Flordeliza Grita','#132 Antonio St. Barangka, Mandaluyong City','Housewife','High School');
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
  PRIMARY KEY (`intRequirementId`),
  UNIQUE KEY `strRequirementDesc_UNIQUE` (`strRequirementDesc`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='list of requirements';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblrequirements`
--
-- ORDER BY:  `intRequirementId`

LOCK TABLES `tblrequirements` WRITE;
/*!40000 ALTER TABLE `tblrequirements` DISABLE KEYS */;
INSERT INTO `tblrequirements` VALUES (1,'Form 137',1),(2,'Certificate of Indigency',1),(3,'Good Moral',1),(4,'Registration Card',1),(5,'Form 138',1),(7,'CTC Grades',1);
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
  `enumTerm` enum('Semester','Trimester','Quarter') NOT NULL,
  PRIMARY KEY (`intSCId`),
  UNIQUE KEY `strSchCour_UNIQUE` (`intSCSchoolId`,`intSCCourseId`),
  KEY `fk_schcour_school_idx` (`intSCSchoolId`),
  KEY `fk_schcour_course_idx` (`intSCCourseId`),
  CONSTRAINT `fk_schcour_course` FOREIGN KEY (`intSCCourseId`) REFERENCES `tblcourse` (`intCourseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_schcour_school` FOREIGN KEY (`intSCSchoolId`) REFERENCES `tblschool` (`intSchoolId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblschcour`
--
-- ORDER BY:  `intSCId`

LOCK TABLES `tblschcour` WRITE;
/*!40000 ALTER TABLE `tblschcour` DISABLE KEYS */;
INSERT INTO `tblschcour` VALUES (1,2,1,'4','Semester'),(2,2,2,'4','Semester'),(3,1,1,'4','Semester');
/*!40000 ALTER TABLE `tblschcour` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblscholarshipreq`
--

DROP TABLE IF EXISTS `tblscholarshipreq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblscholarshipreq` (
  `intSRId` int(11) NOT NULL,
  `intSRRId` int(11) NOT NULL,
  `intSRSTId` int(11) NOT NULL,
  `enumReqtype` enum('application','renewal') NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`intSRId`),
  UNIQUE KEY `strSchReq_UNIQUE` (`intSRRId`,`intSRSTId`,`enumReqtype`),
  KEY `fk_req_sreq_idx` (`intSRRId`),
  KEY `fk_sreq_stype_idx` (`intSRSTId`),
  CONSTRAINT `fk_req_sreq` FOREIGN KEY (`intSRRId`) REFERENCES `tblrequirements` (`intRequirementId`) ON UPDATE CASCADE,
  CONSTRAINT `fk_sreq_stype` FOREIGN KEY (`intSRSTId`) REFERENCES `tblscholarshiptype` (`intSTId`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblscholarshipreq`
--
-- ORDER BY:  `intSRId`

LOCK TABLES `tblscholarshipreq` WRITE;
/*!40000 ALTER TABLE `tblscholarshipreq` DISABLE KEYS */;
INSERT INTO `tblscholarshipreq` VALUES (1,1,1,'application',1),(2,2,1,'application',1),(3,3,1,'application',1),(4,5,1,'application',1),(5,4,1,'renewal',1),(6,7,1,'renewal',1);
/*!40000 ALTER TABLE `tblscholarshipreq` ENABLE KEYS */;
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
  `dblSTAllocation` double NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  PRIMARY KEY (`intSTId`),
  UNIQUE KEY `strSTDesc_UNIQUE` (`strSTDesc`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblscholarshiptype`
--
-- ORDER BY:  `intSTId`

LOCK TABLES `tblscholarshiptype` WRITE;
/*!40000 ALTER TABLE `tblscholarshiptype` DISABLE KEYS */;
INSERT INTO `tblscholarshiptype` VALUES (1,'Special',12000,1),(2,'Grant',10000,1);
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
  `intSGradingId` int(11) DEFAULT NULL,
  `strSchoolName` varchar(60) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  PRIMARY KEY (`intSchoolId`),
  UNIQUE KEY `strSchoolName_UNIQUE` (`strSchoolName`),
  KEY `fk_school_grading_idx` (`intSGradingId`),
  CONSTRAINT `fk_school_grading` FOREIGN KEY (`intSGradingId`) REFERENCES `tblgrading` (`intGradingId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblschool`
--
-- ORDER BY:  `intSchoolId`

LOCK TABLES `tblschool` WRITE;
/*!40000 ALTER TABLE `tblschool` DISABLE KEYS */;
INSERT INTO `tblschool` VALUES (1,1,'University of the Philippines',1),(2,1,'Polytechnic University of the Philippines',1),(3,1,'University of Mandaluyong',1),(5,1,'Concepcion Integrated School Secondary Level (CISSL)',1),(6,1,'Rizal Technological University',1);
/*!40000 ALTER TABLE `tblschool` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblsettings`
--

DROP TABLE IF EXISTS `tblsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblsettings` (
  `intSettingsId` int(11) NOT NULL,
  `datApplyDate` date DEFAULT NULL,
  `isClaiming` tinyint(1) NOT NULL DEFAULT '0',
  `datRenewDate` date DEFAULT '1998-12-19',
  PRIMARY KEY (`intSettingsId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblsettings`
--
-- ORDER BY:  `intSettingsId`

LOCK TABLES `tblsettings` WRITE;
/*!40000 ALTER TABLE `tblsettings` DISABLE KEYS */;
INSERT INTO `tblsettings` VALUES (0,'2018-08-26',0,NULL);
/*!40000 ALTER TABLE `tblsettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblstudentdetails`
--

DROP TABLE IF EXISTS `tblstudentdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblstudentdetails` (
  `intStudentId` int(11) NOT NULL,
  `intSBarangayId` int(11) NOT NULL,
  `intStdSchoolId` int(11) NOT NULL,
  `intStdCourseId` int(11) NOT NULL,
  `strStudentLname` varchar(20) NOT NULL,
  `strStudentFname` varchar(25) NOT NULL,
  `strStudentMname` varchar(20) DEFAULT NULL,
  `datStudentBday` date NOT NULL,
  `strStudentBplace` varchar(40) NOT NULL,
  `strStudentHouseNo` int(11) NOT NULL,
  `strStudentStreet` varchar(30) NOT NULL,
  `strStudentZipCode` varchar(8) NOT NULL,
  `enumStudentGender` enum('male','female') NOT NULL,
  `strStudentCitizenship` varchar(20) NOT NULL,
  `strStudentMobNum` varchar(15) NOT NULL,
  `strStudentEmail` varchar(40) NOT NULL,
  `dblStudentFIncome` double NOT NULL,
  `intStudentSibs` tinyint(4) NOT NULL,
  `enumStudentStat` enum('applicant','scholar','declined') NOT NULL,
  `datStudAppDate` date NOT NULL,
  `enumStatus` enum('Continuing','Forfeited','Graduated') NOT NULL DEFAULT 'Continuing',
  `isRenewal` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`intStudentId`),
  UNIQUE KEY `strStudentEmail_UNIQUE` (`strStudentEmail`),
  UNIQUE KEY `strStudentName_UNIQUE` (`strStudentLname`,`strStudentFname`,`strStudentMname`),
  KEY `fk_student_barangay_idx` (`intSBarangayId`),
  KEY `fk_school_student_idx` (`intStdSchoolId`),
  KEY `fk_course_student_idx` (`intStdCourseId`),
  CONSTRAINT `fk_barangay_student` FOREIGN KEY (`intSBarangayId`) REFERENCES `tblbarangay` (`intBarangayId`) ON UPDATE CASCADE,
  CONSTRAINT `fk_course_student` FOREIGN KEY (`intStdCourseId`) REFERENCES `tblcourse` (`intCourseId`) ON UPDATE CASCADE,
  CONSTRAINT `fk_school_student` FOREIGN KEY (`intStdSchoolId`) REFERENCES `tblschool` (`intSchoolId`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='student details';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblstudentdetails`
--
-- ORDER BY:  `intStudentId`

LOCK TABLES `tblstudentdetails` WRITE;
/*!40000 ALTER TABLE `tblstudentdetails` DISABLE KEYS */;
INSERT INTO `tblstudentdetails` VALUES (1,4,2,2,'Gamayo','Kristine Mae','','1999-05-05','Badoc, Ilocos Norte',54,'Sgt. Esguerra Ave.','1550','female','Filipino','09275491696','kristine.gamayo@yahoo.com',150000,1,'scholar','2018-08-23','Continuing',0),(2,5,2,1,'tolentino','ben hur','grita','1998-12-19','Marikina City',123,'Korea St.','1550','male','Filipino','09565038304','benbenten19@gmail.com',150000,3,'applicant','2018-08-26','Continuing',0);
/*!40000 ALTER TABLE `tblstudentdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblstudentreq`
--

DROP TABLE IF EXISTS `tblstudentreq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblstudentreq` (
  `intARId` int(11) NOT NULL,
  `intARStudId` int(11) NOT NULL,
  `intARRId` int(11) NOT NULL,
  `isSubmitted` tinyint(1) NOT NULL,
  PRIMARY KEY (`intARId`),
  KEY `fk_stud_ar_idx` (`intARStudId`),
  KEY `fk_req_ar_idx` (`intARRId`),
  CONSTRAINT `fk_req_ar` FOREIGN KEY (`intARRId`) REFERENCES `tblscholarshipreq` (`intSRId`) ON UPDATE CASCADE,
  CONSTRAINT `fk_stud_ar` FOREIGN KEY (`intARStudId`) REFERENCES `tblstudentdetails` (`intStudentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblstudentreq`
--
-- ORDER BY:  `intARId`

LOCK TABLES `tblstudentreq` WRITE;
/*!40000 ALTER TABLE `tblstudentreq` DISABLE KEYS */;
INSERT INTO `tblstudentreq` VALUES (1,1,1,1),(2,1,2,1),(3,1,3,1),(4,1,4,1),(5,1,5,0),(6,1,6,0);
/*!40000 ALTER TABLE `tblstudentreq` ENABLE KEYS */;
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
-- ORDER BY:  `intUAId`

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
-- ORDER BY:  `intUCId`

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
-- ORDER BY:  `intUMId`

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
-- ORDER BY:  `intURId`

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
  `intUStudId` int(11) DEFAULT NULL,
  `intBatchId` int(11) DEFAULT NULL,
  `intSchTypeId` int(11) DEFAULT NULL,
  `strUserEmail` varchar(30) NOT NULL,
  `strUserPassword` varchar(25) NOT NULL,
  `enumUserType` enum('admin','student','coordinator') NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  `token` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`strUserId`),
  UNIQUE KEY `intUStudId_UNIQUE` (`intUStudId`),
  KEY `fk_batch_user_idx` (`intBatchId`),
  KEY `fk_stype_user_idx` (`intSchTypeId`),
  KEY `fk_user_student_idx` (`intUStudId`),
  CONSTRAINT `fk_batch_user` FOREIGN KEY (`intBatchId`) REFERENCES `tblbatch` (`intBatchId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_stype_user` FOREIGN KEY (`intSchTypeId`) REFERENCES `tblscholarshiptype` (`intSTId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_student` FOREIGN KEY (`intUStudId`) REFERENCES `tblstudentdetails` (`intStudentId`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblusers`
--
-- ORDER BY:  `strUserId`

LOCK TABLES `tblusers` WRITE;
/*!40000 ALTER TABLE `tblusers` DISABLE KEYS */;
INSERT INTO `tblusers` VALUES ('2018-00001-1',1,NULL,1,'kristine.gamayo@yahoo.com','k9t2zv6b','student',1,'a227fb592b9541f3f06343a4cdc6bed1301762b1e5d9cb11dacfe3e74778da72'),('admin',NULL,NULL,NULL,'','admin','admin',1,NULL),('sms-00001-1',NULL,NULL,1,'','1234','coordinator',1,NULL),('sms-00002-2',NULL,NULL,2,'coordinator@gmail.com','1234','coordinator',1,'06eaffa5deb780306ce169b61ddf4617d5a108a135355752dcd7578f29592cee');
/*!40000 ALTER TABLE `tblusers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'dbsms2'
--
/*!50003 DROP PROCEDURE IF EXISTS `applicant_requirements` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `applicant_requirements`(in StudentId int(11))
BEGIN
SELECT * FROM tblstudentreq as tar 
join(tblscholarshipreq as tsr,tblrequirements as tr,tblscholarshiptype as tst) 
on(tar.intARRId = tsr.intSRId AND tsr.intSRRId = tr.intRequirementId AND tsr.intSRSTId = tst.intSTId)
WHERE intARStudId = StudentId AND enumReqType = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `brgy_district` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `brgy_district`()
BEGIN
SELECT * FROM tblbarangay join(tbldistrict) 
ON (tblbarangay.intBDistrictId=tbldistrict.intDistrictId)
WHERE tblbarangay.isActive = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `budget_info` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `budget_info`(in stype int(11))
BEGIN
SELECT intBudgetId, intBSTId, 
dblAmount, dblExcessAmt, intSlots,enumBudgetStatus,
DATE_FORMAT(datBudgetDate,"%M %d,%Y")as datBudgetDate, tst.* from tblbudget join(tblscholarshiptype as tst) 
on(tblbudget.intBSTId = tst.intSTId)
WHERE intBSTId = stype;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `scholarship_budget` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `scholarship_budget`(in budget_date date)
BEGIN

select * 
from tblscholarshiptype s 
join (tblbudget b) 
on (s.intSTId = b.intBSTId) 
where datBudgetDate like concat(YEAR(budget_date),'%') AND enumBudgetStatus = 2;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `scholarship_requirements` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `scholarship_requirements`(in stype int(11))
BEGIN
SELECT * FROM tblscholarshipreq 
        join tblrequirements on intSRRId=intRequirementId 
        WHERE intSRSTId=stype;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `scholar_requirements` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `scholar_requirements`(in StudentId int(11))
BEGIN
SELECT * FROM tblstudentreq as tar 
join(tblscholarshipreq as tsr,tblrequirements as tr,tblscholarshiptype as tst) 
on(tar.intARRId = tsr.intSRId AND tsr.intSRRId = tr.intRequirementId AND tsr.intSRSTId = tst.intSTId)
WHERE intARStudId = StudentId AND enumReqType = 2;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Scholar_scholarship` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Scholar_scholarship`(in stype int(11))
BEGIN
select * 
FROM tblstudentdetails join tblusers 
on(intStudentId = intUStudId) 
WHERE enumStudentStat = 2 AND intSchTypeId = stype;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `School_Courses` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `School_Courses`()
BEGIN
SELECT *
FROM tblschcour join (tblcourse,tblschool) 
on (intSCCourseId = intCourseId AND intSCSchoolId = intSchoolId);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `student_apply` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `student_apply`()
BEGIN

select distinct intStudentId,strStudentLname,strStudentFname,strStudentMname,
date_format(datStudAppDate,"%M %d %Y") as datStudAppDate,ar.*
from tblstudentdetails sd left join tblstudentreq ar 
on sd.intStudentId = ar.intARStudId
WHERE intARId is null; 

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `student_apply_scholarship` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `student_apply_scholarship`(in scholarship int(11))
BEGIN

select distinct intStudentId,strStudentLname,strStudentFname,strStudentMname,
date_format(datStudAppDate,"%M %d,%Y") as datStudAppDate
from tblstudentdetails sd left join tblstudentreq ar 
on sd.intStudentId = ar.intARStudId
WHERE enumStudentStat = 1 and intARId is not null; 

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `student_claim` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `student_claim`(in stype int(11))
BEGIN
SELECT intStudentId,strStudentLname,strStudentMname,strStudentFname,intClaimId,datDateClaimed,enumBudget
FROM tblstudentdetails join (tblusers,tblclaim) 
on(tblusers.intUStudId = tblstudentdetails.intStudentId AND tblstudentdetails.intStudentId = tblclaim.intCStudId)
WHERE intSchTypeId = stype AND isYear = 1;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `student_claim_one` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `student_claim_one`(in id int(11))
BEGIN
SELECT intStudentId,strStudentLname,strStudentMname,strStudentFname,intClaimId, datDateClaimed 
FROM tblstudentdetails join (tblusers,tblclaim) 
on(tblusers.intUStudId = tblstudentdetails.intStudentId AND tblstudentdetails.intStudentId = tblclaim.intCStudId)
WHERE intClaimId = id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `student_info` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `student_info`(in student_id int(11))
BEGIN

select tsd.intStudentId,tsd.strStudentLname,
tsd.strStudentFname,tsd.strStudentMname,
date_format(tsd.datStudentBday,"%M %d %Y") as datStudentBday,
tsd.strStudentBplace,tsd.strStudentHouseNo,tsd.strStudentStreet,
tsd.strStudentZipCode,tsd.enumStudentGender,tsd.strStudentCitizenship,
tsd.strStudentMobNum,tsd.strStudentEmail,tsd.dblStudentFIncome,
tsd.intStudentSibs,tsd.enumStudentStat,
date_format(tsd.datStudAppDate,"%M %d %Y") as datStudAppDate
,te.*
,tpi.*
,tb.*
,ts.strSchoolName
,tc.strCourseName 
from tblstudentdetails as tsd join (tbleducbg as te,tblparentsinfo as tpi,tblbarangay as tb,tblschool as ts,tblcourse as tc) 
on (tsd.intStudentId = te.intEBGStudId AND tsd.intStudentId = tpi.intPStudentId AND tsd.intSBarangayId = tb.intBarangayId AND ts.intSchoolId = tsd.intStdSchoolId AND tc.intCourseId = tsd.intStdCourseId)
where intStudentId = student_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `student_renew_scholarship` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `student_renew_scholarship`(in scholarship int(11))
BEGIN

select distinct intStudentId,strStudentLname,strStudentFname,strStudentMname
from tblstudentdetails sd left join tblstudentreq ar 
on sd.intStudentId = ar.intARStudId
WHERE enumStudentStat = 2 and intARId is not null and isRenewal = 1; 

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `User_data` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `User_data`(in year varchar(5))
BEGIN
SELECT * from tblusers WHERE strUserid = 
(SELECT max(strUserId) FROM dbsms2.tblusers WHERE strUserId like concat(year,'%'));
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-27 15:48:47
