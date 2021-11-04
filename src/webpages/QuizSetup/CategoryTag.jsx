import "./categoryTag.css";
import { GrFormClose } from 'react-icons/gr';

const CategoryTag = ({categoryNum, category, deleteCategory}) => {
    return (
        <span class="outer-padding">
            <span class="tag-frame">
                {category}
                <button onClick={()=>deleteCategory(categoryNum)}><GrFormClose/></button>
            </span>
        </span>
    )
}

export default CategoryTag
