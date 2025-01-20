class TaskForm{
  elements = {
    taskNameInput: () => cy.get('.new-todo'),
  }

  typeTaskName(text){
    if(!text) return
    this.elements.taskNameInput().type(text)
  }

  createUncheckedTask(text = "Nova tarefa"){
    this.typeTaskName(text)
    this.elements.taskNameInput().type('{enter}')
  }

  createCheckedTask(text = "Tarefa concluída"){
    this.typeTaskName(text)
    this.elements.taskNameInput().type('{enter}')
    cy.get('.todo-list li')
      .contains(text)
      .parent()
      .find('input[type="checkbox"]')
      .check();
  }

}

class TaskList{
  elements = {
    tasks: () => cy.get('.todo-list li'),
  }

  getTasks(){
    return this.elements.tasks()
  }

  getFilters(){
    return cy.get('.filters')
  }
}

const taskForm = new TaskForm()
const taskList = new TaskList()


describe('Manipulação de tarefas', () => {
    beforeEach(() => {
      let host = Cypress.env("TEST_HOST") || 'https://todomvc.com/examples/angular/dist/browser/#/all';
      cy.visit(host);
    });
    it('Criação de tarefa', () => {
      const taskName = 'Nova tarefa'
      taskForm.createUncheckedTask(taskName)
      taskList.getTasks().should('have.length', 1)
      taskList.getTasks().should('contain.text', taskName)
      taskList.getTasks().should('not.have.class', 'completed')
    })

    it('Não deve criar tarefas vazias', () => {
      taskForm.elements.taskNameInput().type('{enter}')
      taskList.getTasks().should('have.length', 0)
    })

    it('Deve marcar tarefa como concluída', () => {
      taskForm.createUncheckedTask()
      taskList.getTasks().should('have.length', 1)
      taskList.getTasks().should('not.have.class', 'completed')
      taskList.getTasks().find('input').check()
      taskList.getTasks().should('have.class', 'completed')
    })

    it('Deve excluir tarefa pendente', () => {
      taskForm.createUncheckedTask()
      taskList.getTasks().should('have.length', 1)
      taskList.getTasks().find('.destroy').click({ force: true })
      taskList.getTasks().should('have.length', 0)
    })

    it('Deve excluir tarefa concluída', () => {
      taskForm.createCheckedTask()
      taskList.getTasks().should('have.length', 1)
      taskList.getTasks().find('.destroy').click({ force: true })
      taskList.getTasks().should('have.length', 0)
    })

    it('Deve filtrar tarefas concluídas', () => {
      const checkedTaskName = 'checked task'
      taskForm.createCheckedTask(checkedTaskName)
      taskForm.createUncheckedTask()
      taskList.getFilters().contains('Completed').click()
      taskList.getTasks().should('have.length', 1)
    })

    it('Deve filtrar tarefas pendentes', () => {
      const checkedTaskName = 'checked task'
      taskForm.createCheckedTask(checkedTaskName)
      taskForm.createUncheckedTask()
      taskList.getFilters().contains('Active').click()
      taskList.getTasks().should('have.length', 1)
    })

    it('Deve limpar tarefas concluídas', () => {
      const checkedTaskName = 'checked task'
      taskForm.createCheckedTask(checkedTaskName)
      taskForm.createUncheckedTask()
      cy.get('.clear-completed').click()
      taskList.getTasks().should('have.length', 1)
      taskList.getTasks().should('not.contain.text', checkedTaskName)
    })

    it('Deve marcar todas as tarefas como concluídas', () => {
      taskForm.createUncheckedTask()
      taskForm.createUncheckedTask()
      taskForm.createUncheckedTask()
      cy.get('.toggle-all').check()
      taskList.getTasks().should('have.class', 'completed')
    })

    it('Deve editar tarefa', () => {
      const taskName = 'Nova tarefa'
      const editedTaskName = 'Tarefa editada'
      taskForm.createUncheckedTask(taskName)
      taskList.getTasks().contains(taskName).dblclick()
      cy.get('.edit').type(editedTaskName + '{enter}')
      taskList.getTasks().should('contain.text', editedTaskName)
    })

    it('Deve excluir tarefa editando o nome para vazio', () => {
      const taskName = 'Nova tarefa'
      taskForm.createUncheckedTask(taskName)
      taskList.getTasks().contains(taskName).dblclick()
      cy.get('.edit').clear().type('{enter}')
      taskList.getTasks().should('have.length', 0)
    })

    it('Deve mostrar quantidade de tarefas pendentes corretamente', () => {
      taskForm.createUncheckedTask()
      taskForm.createUncheckedTask()
      taskForm.createUncheckedTask()
      taskForm.createCheckedTask()
      cy.get('.todo-count').should('contain.text', '3 items left')
    })
})

describe('Links de navegação', () => {
  beforeEach(() => {
    let host = Cypress.env("TEST_HOST") || 'https://todomvc.com/examples/angular/dist/browser/#/all';
    cy.visit(host);
  });

  it('Deve acessar link TodoMvc', () => {
    cy.get('.info a').should('have.attr', 'href', 'http://todomvc.com')
  })

  it('Deve acessar link AngularJS', () => {
    cy.get('.quote footer a').should('have.attr', 'href', 'http://angular.dev')
  })

  it('Deve acessar docs' , () => {
    cy.get('.learn ul li a').should('have.attr', 'href', 'https://angular.dev')
  })

  it('Deve acessar link Github', () => {
    cy.get('.learn footer em a').should('have.attr', 'href', 'https://github.com/tastejs/todomvc/issues')
  })

})