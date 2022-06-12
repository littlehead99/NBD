package com.s25542.NBD6;

import com.basho.riak.client.api.RiakClient;
import com.basho.riak.client.api.commands.kv.DeleteValue;
import com.basho.riak.client.api.commands.kv.FetchValue;
import com.basho.riak.client.api.commands.kv.StoreValue;
import com.basho.riak.client.api.commands.kv.UpdateValue;
import com.basho.riak.client.api.commands.timeseries.Fetch;
import com.basho.riak.client.core.RiakCluster;
import com.basho.riak.client.core.RiakNode;
import com.basho.riak.client.core.query.Location;
import com.basho.riak.client.core.query.Namespace;

import java.net.UnknownHostException;

public class StudentRiak {
    public static class Student {
        public String name;
        public String number;
    }

    public static class StudentUpdate extends UpdateValue.Update<Student> {
        private final Student update;
        public StudentUpdate(Student update){
            this.update = update;
        }

        @Override
        public Student apply(Student t) {
            if(t == null) {
                t = new Student();
            }

            t.name = update.name;
            t.number = update.number;

            return t;
        }
    }

    private static RiakCluster setUpCluster() throws UnknownHostException {
        RiakNode node = new RiakNode.Builder()
                .withRemoteAddress("127.0.0.1")
                .withRemotePort(8087)
                .build();

        RiakCluster cluster = new RiakCluster.Builder(node)
                .build();

        cluster.start();

        return cluster;
    }

    public static void main( String[] args ) {
        try {
            RiakCluster cluster = setUpCluster();
            RiakClient client = new RiakClient(cluster);

            //create student
            Student student = new Student();
            student.name = "Anna";
            student.number = "s12345";

            //add student
            Namespace studentsBucket = new Namespace("students");
            Location studentLocation = new Location(studentsBucket, "s1");
            StoreValue storeStudentOp = new StoreValue.Builder(student)
                    .withLocation(studentLocation)
                    .build();
            String key = client.execute(storeStudentOp).getLocation().getKeyAsString();
            System.out.println("Student information now stored in Riak with key: "+ key);

            //get student
            FetchValue fetchStudentOp = new FetchValue.Builder(studentLocation)
                    .build();
            Student fetchedStudent = client.execute(fetchStudentOp).getValue(Student.class);

            assert(student.getClass() == fetchedStudent.getClass());
            assert(student.name.equals(fetchedStudent.name));
            assert(student.number.equals(fetchedStudent.number));

            System.out.println("Fetched student details: "+ fetchedStudent.name + ' ' + fetchedStudent.number);

            //edit student
            student.name = "Anna Maj";
            StudentUpdate updateStudent = new StudentUpdate(student);
            UpdateValue updateValue = new UpdateValue.Builder(studentLocation)
                    .withUpdate(updateStudent)
                    .build();
            UpdateValue.Response response = client.execute(updateValue);

            FetchValue fetchUpdatedStudentOp = new FetchValue.Builder(studentLocation)
                    .build();
            Student fetchedUpdatedStudent = client.execute(fetchUpdatedStudentOp).getValue(Student.class);

            System.out.println("Student after name update: " + fetchedUpdatedStudent.name + ' ' + fetchedUpdatedStudent.number);

            //delete student
            DeleteValue deleteStudentOp = new DeleteValue.Builder(studentLocation)
                    .build();
            client.execute(deleteStudentOp);

            FetchValue fetchDeletedStudent = new FetchValue.Builder(studentLocation)
                    .withOption(FetchValue.Option.DELETED_VCLOCK, true)
                    .build();
            FetchValue.Response deleteResponse = client.execute(fetchDeletedStudent);
            System.out.println("Student deleted");

            cluster.shutdown();
            
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
