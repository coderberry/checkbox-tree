import { Controller } from '@hotwired/stimulus'
import data from '../data/tree.json'

export default class extends Controller {
  static targets = [
    'template', 
    'container', 
    'tree', 
    'toggler', 
    'spacer', 
    'checkbox', 
    'label'
  ]

  static values = {
    checked: Array,
    parentInputName: String,
    childInputName: String
  }

  connect() {
    console.log('CheckboxTree controller connected')
    console.log(data)

    if (!this.hasCheckedValue) {
      this.checkedValue = []
    }

    this.clearTree()
    this.buildTree(data)
  }

  clearTree() {
    this.containerTarget.innerHTML = ''
  }

  buildTree(data, parent = null) {
    const treeNode = this.templateTarget.content.cloneNode(true)

    const tree = treeNode.querySelector('[data-checkbox-tree-target="tree"]')
    const spacer = treeNode.querySelector('[data-checkbox-tree-target="spacer"]')
    const toggler = treeNode.querySelector('[data-checkbox-tree-target="toggler"]')
    const checkbox = treeNode.querySelector('[data-checkbox-tree-target="checkbox"]')
    const label = treeNode.querySelector('[data-checkbox-tree-target="label"]')
    const childrenContainer = treeNode.querySelector('[data-checkbox-tree-target="children"]')

    tree.dataset.id = data.id
    label.innerText = `${data.title} (${data.id})`
    checkbox.value = data.id

    // append tree to parent
    if (parent) {
      parent.appendChild(treeNode)
    } else {
      tree.classList.add('checkbox-tree__tree--root')
      this.containerTarget.appendChild(treeNode)
    }

    if (data.children.length > 0) {
      spacer.style.width = `${data.depth * 1}rem`

      if (childrenContainer) {
        childrenContainer.dataset.parent = data.id
        childrenContainer.dataset.open = false
        data.children.forEach(child => {
          this.buildTree(child, childrenContainer)
        })
      }
    } else {
      toggler.style.display = 'none'
      spacer.style.width = `${(data.depth * 1) + 1}rem`
      if (childrenContainer) {
        childrenContainer.remove()
      }
    }
  }

  toggleHidden(event) {
    const parentTreeNode = event.target.closest('[data-checkbox-tree-target="tree"]')

    if (parentTreeNode) {
      if (parentTreeNode.dataset.open === 'true') {
        parentTreeNode.dataset.open = false
      } else {
        parentTreeNode.dataset.open = true
      }

      // const childrenNodes = parentChildrenNode.querySelectorAll('[data-checkbox-tree-target="children"]')
      // childrenNodes.forEach(node => {
      //   node.classList.toggle('hidden')
      // })
    }
  }

  toggleCheckbox(event) {
    console.log(event.target)
  }
}
