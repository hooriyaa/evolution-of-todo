from typing import Optional
from manager import TaskManager
from rich.console import Console
from rich.table import Table


def display_menu():
    """Display the main menu options."""
    console = Console()
    console.print("\n[bold]TODO LIST APPLICATION[/bold]")
    console.print("Please select an option:")
    console.print("1. Add Task")
    console.print("2. View Tasks")
    console.print("3. Update Task")
    console.print("4. Delete Task")
    console.print("5. Mark Complete")
    console.print("6. Exit")


def display_tasks(task_manager: TaskManager):
    """Display all tasks in a formatted table."""
    console = Console()
    tasks = task_manager.get_all_tasks()
    
    if not tasks:
        console.print("\n[bold yellow]No tasks found. Use option 1 to add a new task.[/bold yellow]")
        return
    
    table = Table(title="Your Tasks")
    table.add_column("ID", style="dim", width=5)
    table.add_column("Title", style="bold")
    table.add_column("Status", style="bold")
    table.add_column("Description")
    
    for task in tasks:
        status_style = "green" if task.status == "Completed" else "red"
        table.add_row(
            str(task.id),
            task.title,
            f"[{status_style}]{task.status}[/{status_style}]",
            task.description
        )
    
    console.print(table)


def get_valid_task_id() -> Optional[int]:
    """Get a valid task ID from user input."""
    try:
        task_id = int(input("Enter task ID: "))
        return task_id
    except ValueError:
        print("Invalid input. Please enter a numeric task ID.")
        return None


def main():
    """Main function with the while True loop and menu handling."""
    console = Console()
    task_manager = TaskManager()
    
    console.print("[bold green]Welcome to the Todo List Application![/bold green]")
    
    while True:
        display_menu()
        
        try:
            choice = input("\nEnter your choice (1-6): ").strip()
            
            if choice == "1":
                # Add Task
                title = input("Enter task title (1-200 characters): ").strip()
                
                if not title:
                    print("Title cannot be empty.")
                    continue
                
                description = input("Enter task description (optional): ").strip()
                
                try:
                    task_id = task_manager.add_task(title, description)
                    print(f"Task added successfully with ID: {task_id}")
                except ValueError as e:
                    print(f"Error adding task: {e}")
            
            elif choice == "2":
                # View Tasks
                display_tasks(task_manager)
            
            elif choice == "3":
                # Update Task
                task_id = get_valid_task_id()
                if task_id is None:
                    continue
                
                # Check if task exists
                task = task_manager.get_task_by_id(task_id)
                if task is None:
                    print(f"Task with ID {task_id} not found.")
                    continue
                
                # Get new values (allow user to keep existing values by pressing enter)
                print(f"Current title: {task.title}")
                new_title_input = input("Enter new title (or press Enter to keep current): ").strip()
                new_title = new_title_input if new_title_input else None
                
                if new_title:  # Validate title if it's being changed
                    if not (1 <= len(new_title) <= 200):
                        print("Title must be between 1 and 200 characters.")
                        continue
                
                print(f"Current description: {task.description}")
                new_description_input = input("Enter new description (or press Enter to keep current): ").strip()
                new_description = new_description_input if new_description_input else None
                
                try:
                    result = task_manager.update_task(task_id, new_title, new_description)
                    if result:
                        print("Task updated successfully.")
                    else:
                        print("Error updating task.")
                except ValueError as e:
                    print(f"Error updating task: {e}")
            
            elif choice == "4":
                # Delete Task
                task_id = get_valid_task_id()
                if task_id is None:
                    continue
                
                result = task_manager.delete_task(task_id)
                if result:
                    print("Task deleted successfully.")
                else:
                    print(f"Task with ID {task_id} not found.")
            
            elif choice == "5":
                # Mark Complete
                task_id = get_valid_task_id()
                if task_id is None:
                    continue
                
                result = task_manager.mark_complete(task_id)
                if result:
                    print("Task marked as complete successfully.")
                else:
                    print(f"Task with ID {task_id} not found.")
            
            elif choice == "6":
                # Exit
                console.print("[bold red]Goodbye![/bold red]")
                break
            
            else:
                # Invalid input
                print("Invalid choice. Please enter a number between 1 and 6.")
        
        except ValueError:
            # Handle non-numeric input for menu options
            print("Invalid input. Please enter a number between 1 and 6.")
        except KeyboardInterrupt:
            # Handle Ctrl+C gracefully
            console.print("\n[bold red]\nGoodbye![/bold red]")
            break
        except Exception as e:
            # Handle any other unexpected errors
            console.print(f"[bold red]An error occurred: {e}[/bold red]")


if __name__ == "__main__":
    main()