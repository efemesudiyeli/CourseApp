// Course sınıfı

class Course {
    constructor(img, title, instructor) {
        this.courseId = Math.floor(Math.random() * 10000);
        this.img = img;
        this.title = title;
        this.instructor = instructor;

    }
}

class UI {

    addCourseToList(course) {
        // Boş kurs yayınlamayı önlemek.
        if (course.img != "" && course.title != "" && course.instructor != "") {
            const list = document.getElementById('course-list');
            var html = ` 
                <tr>
                    <td> <img  src="img/${course.img}"></td>
                    <td> ${course.title}</td>
                    <td> ${course.instructor}</td>
                    <td> <a id="delete" href="#" data-id="${course.courseId}" class ="btn btn-danger btn-sm delete">Delete</a>  </td>
                <tr> `
            // Listeye htmlyi eklemek
            list.innerHTML += html;
        }
    }

    // Clear after click save button
    clearControls(course) {
        let title = document.getElementById('title').value = ""
        let instructor = document.getElementById('instructor').value = ""
        let image = document.getElementById('image').value = ""
    }

    // Delete course via delete button
    deleteCourse(e) {
        if (e.classList.contains('delete')) {
            e.parentElement.parentElement.remove()
            this.showAlert("Course has been deleted.", "warning")
        }
    }

    showAlert(alertMsg, alertType) {
        const form = document.querySelector('#new-course');
        let alert =
            `
    <div class="alert alert-${alertType}" role="alert">
                            ${alertMsg}
                        </div>
    
    `;
        form.insertAdjacentHTML("beforebegin", alert)
        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 5000);
    }


}

class Storage {

    static getCourses() {
        // local storagedan bilgileri al
        let courses;

        if (localStorage.getItem('courses') === null) {
            courses = [];
        } else {
            courses = JSON.parse(localStorage.getItem('courses'));
        }


        return courses;

    }

    static displayCourses() {
        // aldığın bilgileri göster
        const courses = Storage.getCourses()
        courses.forEach(course => {
            const ui = new UI();
            ui.addCourseToList(course)
        });
    }

    static addCourse(course) {
        //course ekle
        const courses = Storage.getCourses()
        courses.push(course);
        localStorage.setItem('courses', JSON.stringify(courses));

    }

    static deleteCourse(element) {
        // course sil
        if (element.classList.contains('delete')) {
            const id = element.getAttribute('data-id');

            const courses = Storage.getCourses();

            courses.forEach((course, index) => {

                if (course.courseId == id) {
                    courses.splice(index, 1);
                }

            });

            localStorage.setItem('courses', JSON.stringify(courses))

        }

    }

}



// Save Course
document.getElementById('save').addEventListener('click', (event) => {


    let title = document.getElementById('title').value
    let instructor = document.getElementById('instructor').value
    let image = document.getElementById('image').value
    // UI
    const ui = new UI();
    if (title != "" && instructor != "" && image != "") {
        const course = new Course(image, title, instructor);
        console.log(course)
        // Add course to list
        ui.addCourseToList(course);
        // save to local storage
        Storage.addCourse(course);

        // Clear controls
        ui.clearControls();
        ui.showAlert("Course has been added.", "success")


    } else {
        // Inputlar boş girilirse.
        ui.showAlert("Please enter course.", "danger")

    }


    // Sayfa yenilenmesini önlemek için.
    event.preventDefault();

});

// Delete Course
document.getElementById('course-list').addEventListener('click', (e) => {

    let ui = new UI()
    // delete course
    ui.deleteCourse(e.target)
    // delete from local storage
    Storage.deleteCourse(e.target)

})

// sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', Storage.displayCourses);

