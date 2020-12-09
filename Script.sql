
CREATE TABLE Appointment (
	aptID int NOT NULL,
    date varchar(255),
	time varchar(255)
);

GO

CREATE TABLE PatientVisit (
	visitID int NOT NULL,
    patientID int NOT NULL,
	date varchar(255), 
	time varchar(255)
);

GO

CREATE TABLE Profile (
	userID int NOT NULL,
    address varchar(255),
    phone varchar(255),
	height varchar(255),
	weight varchar(255),
	dob varchar(255),
	sex varchar(255)
);

GO

CREATE TABLE Users (
	userID int NOT NULL,
    name varchar(255),
    email varchar(255),
	pass varchar(255),
	type varchar(255)
);

GO

CREATE procedure [user].[UpdateProfile]  
(  
	@userID int,
    @address varchar(255),
    @phone varchar(255),
	@height varchar(255),
	@weight varchar(255),
	@dob varchar(255),
	@sex varchar(255)
)  
AS  
BEGIN  
update Profile set

	address = @address,
	phone = @phone,
	height = @height,
	weight = @weight,
	dob = @dob,
	sex = @sex

where userID = @userID
END

GO

CREATE procedure [user].[UpdateAppointment]  
(  
	@aptID int,
	@date varchar(255),
	@time varchar(255)
)  
AS  
BEGIN  
update Appointment set

	date = @date,
	time = @time

where aptID = @aptID
END

GO

CREATE procedure [user].[UpdatePatientVisit]  
(  
	@visitID int,
	@patientID int,
	@date varchar(255),
	@time varchar(255)
)  
AS  
BEGIN  
update PatientVisit set

	patientID = @patientID,
	date = @date,
	time = @time

where visitID = @visitID
END

GO

CREATE procedure [user].[UpdateUsers]  
(  
	@userID int,
    @name varchar(255),
    @email varchar(255),
	@pass varchar(255),
	@type varchar(255)
)  
AS  
BEGIN  
update Users set

	userID = @userID,
	name = @name,
	email = @email,
	pass = @pass,
	type = @type

where userID = @userID
END

GO

CREATE procedure [user].[DeleteAppointment]  
(  
	@aptID int
)  
AS  
BEGIN  
delete from Appointment where aptID=@aptID  
END

GO

CREATE procedure [user].[DeleteProfile]  
(  
	@userID int
)  
AS  
BEGIN  
delete from Profile where userID=@userID  
END

GO

CREATE procedure [user].[DeleteUser]  
(  
@userID int  
)  
AS  
BEGIN  
delete from Users where userID=@userID  
END

GO

CREATE procedure [user].[DeletePatientVisit]  
(  
	@visitID int
)  
AS  
BEGIN  
delete from PatientVisit where visitID = @visitID  
END

GO

CREATE procedure [user].[InsertUser]  
(  
	@userID int,
    @name varchar(255),
    @email varchar(255),
	@pass varchar(255),
	@type varchar(255)
)  
AS  
BEGIN  
insert into Users (userID,name,email,pass,type) values(@userID,@name,@email,@pass,@type)  
END

GO

CREATE procedure [user].[InsertAppointment]  
(  
	@aptID int,
	@date varchar(255),
	@time varchar(255)
)  
AS  
BEGIN  
insert into Appointment (aptID,date,time) values(@aptID,@date,@time)  
END

GO

CREATE procedure [user].[InsertPatientVisit]  
(  
	@visitID int,
    @patientID int,
	@date varchar(255),
	@time varchar(255)
)  
AS  
BEGIN  
insert into PatientVisit (visitID,patientID,date,time) values(@visitID,@patientID,@date,@time)  
END

GO

CREATE procedure [user].[InsertProfile]  
(  
	@userID int,
    @address varchar(255),
    @phone varchar(255),
	@height varchar(255),
	@weight varchar(255),
	@dob varchar(255),
	@sex varchar(255)
)  
AS  
BEGIN  
insert into Profile (userID,address,phone,height,weight,dob,sex) values(@userID,@address,@phone,@height,@weight,@dob,@sex)  
END

GO

insert into Appointment (aptID,date,time) values (1,'June 01, 2021','10:00 AM')
insert into Appointment (aptID,date,time) values (2,'June 01, 2021','11:00 AM')
insert into Appointment (aptID,date,time) values (3,'June 01, 2021','12:00 AM')
insert into Appointment (aptID,date,time) values (4,'June 01, 2021','01:00 PM')
insert into Appointment (aptID,date,time) values (5,'June 01, 2021','02:00 PM')
insert into Appointment (aptID,date,time) values (6,'June 01, 2021','03:00 PM')
insert into Appointment (aptID,date,time) values (7,'June 02, 2021','10:00 AM')
insert into Appointment (aptID,date,time) values (8,'June 02, 2021','11:00 AM')
insert into Appointment (aptID,date,time) values (9,'June 02, 2021','12:00 AM')
insert into Appointment (aptID,date,time) values (10,'June 02, 2021','01:00 PM')
insert into Appointment (aptID,date,time) values (11,'June 02, 2021','02:00 PM')
insert into Appointment (aptID,date,time) values (12,'June 02, 2021','03:00 PM')
insert into Appointment (aptID,date,time) values (13,'June 03, 2021','10:00 AM')
insert into Appointment (aptID,date,time) values (14,'June 03, 2021','11:00 AM')
insert into Appointment (aptID,date,time) values (15,'June 03, 2021','12:00 AM')
insert into Appointment (aptID,date,time) values (16,'June 03, 2021','01:00 PM')
insert into Appointment (aptID,date,time) values (17,'June 03, 2021','02:00 PM')
insert into Appointment (aptID,date,time) values (18,'June 03, 2021','03:00 PM')

